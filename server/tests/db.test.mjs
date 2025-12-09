import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { User, Playlist, Song, PlaylistSong, initializeDB } = require('../db/models/index');
const PostgresDBManager = require('../db/impl/PostgresDBManager');
const bcrypt = require('bcryptjs');

describe('Database Operations', () => {
    let databaseManager;
    let testUserId;
    let testPlaylistId;
    let testSongId;

    beforeAll(async () => {
        databaseManager = new PostgresDBManager();
        await initializeDB();
    });

    afterAll(async () => {
        if (testSongId) {
            try {
                await databaseManager.deleteById(Song, testSongId);
            } catch (err) {}
        }
        if (testPlaylistId) {
            try {
                await databaseManager.deleteById(Playlist, testPlaylistId);
            } catch (err) {}
        }
        if (testUserId) {
            try {
                await databaseManager.deleteById(User, testUserId);
            } catch (err) {}
        }
    });

    describe('User CRUD Operations', () => {
        it('should create a user', async () => {
            const uniqueId = Date.now() + Math.random();
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('testpassword123', salt);
            
            const user = await databaseManager.save(User, {
                userName: `TestUser_${uniqueId}`,
                email: `test_${uniqueId}@example.com`,
                passwordHash: passwordHash,
                profileImage: 'https://via.placeholder.com/150'
            });

            expect(user).toBeDefined();
            expect(user.id).toBeDefined();
            expect(user.userName).toBe(`TestUser_${uniqueId}`);
            expect(user.email).toBe(`test_${uniqueId}@example.com`);
            
            await databaseManager.deleteById(User, user.id);
        });

        it('should read a user by ID', async () => {
            const uniqueId = Date.now() + Math.random();
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('testpassword123', salt);
            const testUser = await databaseManager.save(User, {
                userName: `TestUserForRead_${uniqueId}`,
                email: `testread_${uniqueId}@example.com`,
                passwordHash: passwordHash,
                profileImage: 'https://via.placeholder.com/150'
            });
            
            const user = await databaseManager.readOneById(User, testUser.id);
            expect(user).toBeDefined();
            expect(user.id).toBe(testUser.id);
            
            await databaseManager.deleteById(User, testUser.id);
        });

        it('should read a user by criteria', async () => {
            const uniqueId = Date.now() + Math.random();
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('testpassword123', salt);
            const testUser = await databaseManager.save(User, {
                userName: `TestUserForCriteria_${uniqueId}`,
                email: `testcriteria_${uniqueId}@example.com`,
                passwordHash: passwordHash,
                profileImage: 'https://via.placeholder.com/150'
            });
            
            const user = await databaseManager.readOne(User, { email: `testcriteria_${uniqueId}@example.com` });
            expect(user).toBeDefined();
            expect(user.email).toBe(`testcriteria_${uniqueId}@example.com`);
            
            await databaseManager.deleteById(User, testUser.id);
        });

        it('should update a user', async () => {
            const uniqueId = Date.now() + Math.random();
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('testpassword123', salt);
            const user = await databaseManager.save(User, {
                userName: `TestUserForUpdate_${uniqueId}`,
                email: `testupdate_${uniqueId}@example.com`,
                passwordHash: passwordHash,
                profileImage: 'https://via.placeholder.com/150'
            });
            const userId = user.id;
            
            const updatedUser = await databaseManager.save(User, {
                id: userId,
                userName: `UpdatedTestUser_${uniqueId}`,
                email: `testupdate_${uniqueId}@example.com`,
                passwordHash: 'hash',
                profileImage: 'https://via.placeholder.com/150'
            });

            expect(updatedUser.userName).toBe(`UpdatedTestUser_${uniqueId}`);
            
            await databaseManager.deleteById(User, userId);
        });

        it('should read all users', async () => {
            const users = await databaseManager.readAll(User, {});
            expect(Array.isArray(users)).toBe(true);
            expect(users.length).toBeGreaterThan(0);
        });

        it('should delete a user', async () => {
            const uniqueId = Date.now() + Math.random();
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('testpassword123', salt);
            const user = await databaseManager.save(User, {
                userName: `TestUserForDelete_${uniqueId}`,
                email: `testdelete_${uniqueId}@example.com`,
                passwordHash: passwordHash,
                profileImage: 'https://via.placeholder.com/150'
            });
            const userId = user.id;
            
            await databaseManager.deleteById(User, userId);
            const deletedUser = await databaseManager.readOneById(User, userId);
            expect(deletedUser).toBeNull();
        });
    });

    describe('Playlist CRUD Operations', () => {
        let ownerId;
        let uniqueId;

        beforeEach(async () => {
            uniqueId = Date.now() + Math.random();
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('testpassword123', salt);
            const user = await databaseManager.save(User, {
                userName: `PlaylistOwner_${uniqueId}`,
                email: `playlistowner_${uniqueId}@example.com`,
                passwordHash: passwordHash,
                profileImage: 'https://via.placeholder.com/150'
            });
            ownerId = user.id;
        });

        afterEach(async () => {
            if (testPlaylistId) {
                try {
                    await databaseManager.deleteById(Playlist, testPlaylistId);
                } catch (err) {}
                testPlaylistId = null;
            }
            if (ownerId) {
                try {
                    await databaseManager.deleteById(User, ownerId);
                } catch (err) {}
            }
        });

        it('should create a playlist', async () => {
            const playlist = await databaseManager.save(Playlist, {
                name: 'Test Playlist',
                ownerId: ownerId
            });

            expect(playlist).toBeDefined();
            expect(playlist.id).toBeDefined();
            expect(playlist.name).toBe('Test Playlist');
            expect(playlist.ownerId).toBe(ownerId);
            testPlaylistId = playlist.id;
        });

        it('should read a playlist by ID', async () => {
            const playlist = await databaseManager.save(Playlist, {
                name: 'Test Playlist Read',
                ownerId: ownerId
            });
            testPlaylistId = playlist.id;

            const readPlaylist = await databaseManager.readOneById(Playlist, testPlaylistId);
            expect(readPlaylist).toBeDefined();
            expect(readPlaylist.id).toBe(testPlaylistId);
            expect(readPlaylist.name).toBe('Test Playlist Read');
        });

        it('should read playlists by criteria', async () => {
            await databaseManager.save(Playlist, {
                name: 'Test Playlist Criteria',
                ownerId: ownerId
            });

            const playlists = await databaseManager.readAll(Playlist, { ownerId: ownerId });
            expect(Array.isArray(playlists)).toBe(true);
            expect(playlists.length).toBeGreaterThan(0);
        });

        it('should update a playlist', async () => {
            const playlist = await databaseManager.save(Playlist, {
                name: 'Original Name',
                ownerId: ownerId
            });
            testPlaylistId = playlist.id;

            const updatedPlaylist = await databaseManager.save(Playlist, {
                id: testPlaylistId,
                name: 'Updated Name',
                ownerId: ownerId
            });

            expect(updatedPlaylist.name).toBe('Updated Name');
        });

        it('should delete a playlist', async () => {
            const playlist = await databaseManager.save(Playlist, {
                name: 'To Be Deleted',
                ownerId: ownerId
            });
            const playlistId = playlist.id;

            await databaseManager.deleteById(Playlist, playlistId);
            const deletedPlaylist = await databaseManager.readOneById(Playlist, playlistId);
            expect(deletedPlaylist).toBeNull();
        });
    });

    describe('Song CRUD Operations', () => {
        let ownerId;
        let uniqueId;

        beforeEach(async () => {
            uniqueId = Date.now() + Math.random();
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('testpassword123', salt);
            const user = await databaseManager.save(User, {
                userName: `SongOwner_${uniqueId}`,
                email: `songowner_${uniqueId}@example.com`,
                passwordHash: passwordHash,
                profileImage: 'https://via.placeholder.com/150'
            });
            ownerId = user.id;
        });

        afterEach(async () => {
            if (testSongId) {
                try {
                    await databaseManager.deleteById(Song, testSongId);
                } catch (err) {}
                testSongId = null;
            }
            if (ownerId) {
                try {
                    await databaseManager.deleteById(User, ownerId);
                } catch (err) {}
            }
        });

        it('should create a song', async () => {
            const song = await databaseManager.save(Song, {
                title: 'Test Song',
                artist: 'Test Artist',
                year: 2024,
                youTubeId: 'test123',
                ownerId: ownerId
            });

            expect(song).toBeDefined();
            expect(song.id).toBeDefined();
            expect(song.title).toBe('Test Song');
            expect(song.artist).toBe('Test Artist');
            expect(song.year).toBe(2024);
            testSongId = song.id;
        });

        it('should read a song by ID', async () => {
            const song = await databaseManager.save(Song, {
                title: 'Test Song Read',
                artist: 'Test Artist',
                year: 2024,
                youTubeId: 'test456',
                ownerId: ownerId
            });
            testSongId = song.id;

            const readSong = await databaseManager.readOneById(Song, testSongId);
            expect(readSong).toBeDefined();
            expect(readSong.id).toBe(testSongId);
            expect(readSong.title).toBe('Test Song Read');
        });

        it('should read songs by criteria', async () => {
            await databaseManager.save(Song, {
                title: 'Test Song Criteria',
                artist: 'Test Artist',
                year: 2024,
                youTubeId: 'test789',
                ownerId: ownerId
            });

            const songs = await databaseManager.readAll(Song, { ownerId: ownerId });
            expect(Array.isArray(songs)).toBe(true);
            expect(songs.length).toBeGreaterThan(0);
        });

        it('should update a song', async () => {
            const song = await databaseManager.save(Song, {
                title: 'Original Title',
                artist: 'Test Artist',
                year: 2024,
                youTubeId: 'test999',
                ownerId: ownerId
            });
            testSongId = song.id;

            const updatedSong = await databaseManager.save(Song, {
                id: testSongId,
                title: 'Updated Title',
                artist: 'Test Artist',
                year: 2024,
                youTubeId: 'test999',
                ownerId: ownerId
            });

            expect(updatedSong.title).toBe('Updated Title');
        });

        it('should delete a song', async () => {
            const song = await databaseManager.save(Song, {
                title: 'To Be Deleted',
                artist: 'Test Artist',
                year: 2024,
                youTubeId: 'test000',
                ownerId: ownerId
            });
            const songId = song.id;

            await databaseManager.deleteById(Song, songId);
            const deletedSong = await databaseManager.readOneById(Song, songId);
            expect(deletedSong).toBeNull();
        });
    });

    describe('PlaylistSong CRUD Operations', () => {
        let ownerId;
        let playlistId;
        let songId;
        let uniqueId;

        beforeEach(async () => {
            uniqueId = Date.now() + Math.random();
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('testpassword123', salt);
            const user = await databaseManager.save(User, {
                userName: `PlaylistSongOwner_${uniqueId}`,
                email: `playlistsongowner_${uniqueId}@example.com`,
                passwordHash: passwordHash,
                profileImage: 'https://via.placeholder.com/150'
            });
            ownerId = user.id;

            const playlist = await databaseManager.save(Playlist, {
                name: `Test Playlist for Songs ${uniqueId}`,
                ownerId: ownerId
            });
            playlistId = playlist.id;

            const song = await databaseManager.save(Song, {
                title: `Playlist Song ${uniqueId}`,
                artist: 'Test Artist',
                year: 2024,
                youTubeId: `playlist123_${uniqueId}`,
                ownerId: ownerId
            });
            songId = song.id;
        });

        afterEach(async () => {
            if (playlistId) {
                try {
                    await databaseManager.deleteById(Playlist, playlistId);
                } catch (err) {}
            }
            if (songId) {
                try {
                    await databaseManager.deleteById(Song, songId);
                } catch (err) {}
            }
            if (ownerId) {
                try {
                    await databaseManager.deleteById(User, ownerId);
                } catch (err) {}
            }
        });

        it('should create a PlaylistSong entry', async () => {
            const playlistSong = await databaseManager.save(PlaylistSong, {
                playlistId: playlistId,
                songId: songId,
                order: 0
            });

            expect(playlistSong).toBeDefined();
            expect(playlistSong.id).toBeDefined();
            expect(playlistSong.playlistId).toBe(playlistId);
            expect(playlistSong.songId).toBe(songId);
            expect(playlistSong.order).toBe(0);
        });

        it('should read PlaylistSong entries by criteria', async () => {
            await databaseManager.save(PlaylistSong, {
                playlistId: playlistId,
                songId: songId,
                order: 0
            });

            const playlistSongs = await databaseManager.readAll(PlaylistSong, {
                playlistId: playlistId
            });

            expect(Array.isArray(playlistSongs)).toBe(true);
            expect(playlistSongs.length).toBeGreaterThan(0);
        });

        it('should update PlaylistSong order', async () => {
            const playlistSong = await databaseManager.save(PlaylistSong, {
                playlistId: playlistId,
                songId: songId,
                order: 0
            });

            const updated = await databaseManager.save(PlaylistSong, {
                id: playlistSong.id,
                playlistId: playlistId,
                songId: songId,
                order: 5
            });

            expect(updated.order).toBe(5);
        });

        it('should delete a PlaylistSong entry', async () => {
            const playlistSong = await databaseManager.save(PlaylistSong, {
                playlistId: playlistId,
                songId: songId,
                order: 0
            });

            await databaseManager.deleteById(PlaylistSong, playlistSong.id);
            const deleted = await databaseManager.readOneById(PlaylistSong, playlistSong.id);
            expect(deleted).toBeNull();
        });
    });

    describe('Edge Cases and Error Handling', () => {
        it('should handle reading non-existent user', async () => {
            const user = await databaseManager.readOneById(User, 999999);
            expect(user).toBeNull();
        });

        it('should handle reading non-existent playlist', async () => {
            const playlist = await databaseManager.readOneById(Playlist, 999999);
            expect(playlist).toBeNull();
        });

        it('should handle reading non-existent song', async () => {
            const song = await databaseManager.readOneById(Song, 999999);
            expect(song).toBeNull();
        });

        it('should handle empty criteria in readAll', async () => {
            const users = await databaseManager.readAll(User, {});
            expect(Array.isArray(users)).toBe(true);
        });

        it('should handle invalid criteria in readOne', async () => {
            const user = await databaseManager.readOne(User, { email: 'nonexistent@example.com' });
            expect(user).toBeNull();
        });
    });
});

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { User, Playlist, Song, PlaylistSong, initializeDB } = require('../db/models/index');
const PostgresDBManager = require('../db/impl/PostgresDBManager');

const databaseManager = new PostgresDBManager();

async function loadData() {
    try {
        console.log('Initializing database...');
        await initializeDB();
        console.log('Database initialized.');

        const dataPath = path.join(__dirname, '../../PlaylisterData.json');
        console.log(`Loading data from ${dataPath}...`);
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(rawData);

        console.log(`Found ${data.users.length} users and ${data.playlists.length} playlists`);

        const userMap = new Map();
        const songMap = new Map();
        const playlistMap = new Map();

        console.log('\n=== Loading Users ===');
        for (const userData of data.users) {
            try {
                const existingUser = await databaseManager.readOne(User, { email: userData.email });
                if (existingUser) {
                    console.log(`User ${userData.email} already exists, skipping...`);
                    userMap.set(userData.email, existingUser.id);
                    continue;
                }

                const defaultPassword = 'password123';
                const saltRounds = 10;
                const salt = await bcrypt.genSalt(saltRounds);
                const passwordHash = await bcrypt.hash(defaultPassword, salt);

                const user = await databaseManager.save(User, {
                    userName: userData.name,
                    email: userData.email,
                    passwordHash: passwordHash,
                    profileImage: 'https://via.placeholder.com/150'
                });

                userMap.set(userData.email, user.id);
                console.log(`Created user: ${userData.name} (${userData.email})`);
            } catch (err) {
                console.error(`Error creating user ${userData.email}:`, err.message);
            }
        }

        console.log(`\n=== Loading Songs ===`);
        const allSongs = new Set();
        const songDataMap = new Map();

        for (const playlist of data.playlists) {
            if (!playlist.songs || !Array.isArray(playlist.songs)) {
                continue;
            }

            for (const songData of playlist.songs) {
                if (!songData.title || !songData.artist || !songData.year || !songData.youTubeId) {
                    console.warn(`Skipping invalid song: ${JSON.stringify(songData)}`);
                    continue;
                }

                const songKey = `${songData.title}|${songData.artist}|${songData.year}`;
                if (!allSongs.has(songKey)) {
                    allSongs.add(songKey);
                    songDataMap.set(songKey, {
                        ...songData,
                        ownerEmail: playlist.ownerEmail
                    });
                }
            }
        }

        console.log(`Found ${songDataMap.size} unique songs to create`);

        for (const [songKey, songData] of songDataMap.entries()) {
            try {
                const ownerId = userMap.get(songData.ownerEmail);
                if (!ownerId) {
                    console.warn(`Owner ${songData.ownerEmail} not found for song ${songData.title}, skipping...`);
                    continue;
                }

                const existingSong = await databaseManager.readOne(Song, {
                    title: songData.title,
                    artist: songData.artist,
                    year: songData.year
                });

                if (existingSong) {
                    songMap.set(songKey, existingSong.id);
                    continue;
                }

                const song = await databaseManager.save(Song, {
                    title: songData.title,
                    artist: songData.artist,
                    year: songData.year,
                    youTubeId: songData.youTubeId,
                    ownerId: ownerId
                });

                songMap.set(songKey, song.id);
            } catch (err) {
                console.error(`Error creating song ${songData.title}:`, err.message);
            }
        }

        console.log(`\n=== Loading Playlists ===`);
        for (const playlistData of data.playlists) {
            try {
                if (!playlistData.name || !playlistData.ownerEmail) {
                    console.warn(`Skipping invalid playlist: ${JSON.stringify(playlistData)}`);
                    continue;
                }

                const ownerId = userMap.get(playlistData.ownerEmail);
                if (!ownerId) {
                    console.warn(`Owner ${playlistData.ownerEmail} not found for playlist ${playlistData.name}, skipping...`);
                    continue;
                }

                const existingPlaylist = await databaseManager.readOne(Playlist, {
                    name: playlistData.name,
                    ownerId: ownerId
                });

                let playlist;
                if (existingPlaylist) {
                    playlist = existingPlaylist;
                    console.log(`Playlist ${playlistData.name} already exists, updating songs...`);
                } else {
                    playlist = await databaseManager.save(Playlist, {
                        name: playlistData.name,
                        ownerId: ownerId
                    });
                    console.log(`Created playlist: ${playlistData.name}`);
                }

                playlistMap.set(playlist.id, playlist);

                if (playlistData.songs && Array.isArray(playlistData.songs)) {
                    const existingPlaylistSongs = await databaseManager.readAll(PlaylistSong, {
                        playlistId: playlist.id
                    });

                    for (const existingPS of existingPlaylistSongs) {
                        await databaseManager.deleteById(PlaylistSong, existingPS.id);
                    }

                    for (let order = 0; order < playlistData.songs.length; order++) {
                        const songData = playlistData.songs[order];
                        if (!songData.title || !songData.artist || !songData.year) {
                            continue;
                        }

                        const songKey = `${songData.title}|${songData.artist}|${songData.year}`;
                        const songId = songMap.get(songKey);

                        if (!songId) {
                            console.warn(`Song ${songKey} not found, skipping...`);
                            continue;
                        }

                        try {
                            await databaseManager.save(PlaylistSong, {
                                playlistId: playlist.id,
                                songId: songId,
                                order: order
                            });
                        } catch (err) {
                            console.error(`Error adding song to playlist:`, err.message);
                        }
                    }
                }
            } catch (err) {
                console.error(`Error creating playlist ${playlistData.name}:`, err.message);
            }
        }

        console.log('\n=== Data Loading Complete ===');
        console.log(`Users: ${userMap.size}`);
        console.log(`Songs: ${songMap.size}`);
        console.log(`Playlists: ${playlistMap.size}`);
    } catch (err) {
        console.error('Error loading data:', err);
        process.exit(1);
    }
}

loadData().then(() => {
    console.log('Script completed successfully.');
    process.exit(0);
}).catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});

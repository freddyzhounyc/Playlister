const PostgresDBManager = require('../db/impl/PostgresDBManager');
const { Playlist, User, Song, PlaylistSong, PlaylistListener } = require('../db/models/index');
const { Sequelize } = require('sequelize');
const auth = require('../auth/index');

class PlaylistController {

    // Dependency Injection
    constructor(databaseManager, playlist, user, song, playlistSong, playlistListener) {
        this.databaseManager = databaseManager;
        this.playlist = playlist;
        this.user = user;
        this.song = song;
        this.playlistSong = playlistSong;
        this.playlistListener = playlistListener;
    }

    createPlaylist = async (req, res) => {
        try {
            if (!req.body)
                return res.status(400).json({
                    success: false,
                    error: 'You must provide a Playlist'
                });
            
            // Check for duplicate name for this user
            const existingPlaylists = await this.databaseManager.readAll(this.playlist, { 
                ownerId: req.body.ownerId,
                name: req.body.name 
            });
            if (existingPlaylists.length > 0) {
                return res.status(400).json({
                    success: false,
                    errorMessage: "You already have a playlist with this name."
                });
            }

            let playlist = await this.databaseManager.save(this.playlist, { 
                name: req.body.name, 
                ownerId: req.body.ownerId 
            });
            return res.status(201).json({
                success: true,
                playlist: {
                    id: playlist.id,
                    name: playlist.name,
                    ownerId: playlist.ownerId
                }
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                errorMessage: err.message
            });
        }
    }

    getPlaylistById = async (req, res) => {
        try {
            const list = await this.databaseManager.readOneById(this.playlist, req.params.id);
            if (!list) {
                return res.status(404).json({
                    success: false,
                    errorMessage: "Playlist not found"
                });
            }
            
            return res.status(200).json({
                success: true,
                playlist: {
                    id: list.id,
                    name: list.name,
                    ownerId: list.ownerId
                }
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                errorMessage: err.message
            });
        }
    }

    getPlaylistPairs = async (req, res) => {
        const userId = auth.verifyUser(req);
        // Guest
        if (!userId)
            return res.status(200).json({
                success: true,
                idNamePairs: []
            });
        
        try {
            // Registered Users
            let playlists = await this.databaseManager.readAll(this.playlist, { ownerId: userId });
            let result = [];
            for (let key in playlists) {
                result.push({
                    id: playlists[key].id,
                    name: playlists[key].name
                });
            }
            return res.status(200).json({
                success: true,
                idNamePairs: result
            });
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                success: false,
                errorMessage: err.message
            });
        }
    }

    getPlaylists = async (req, res) => {
        try {
            const userId = auth.verifyUser(req);
            const { 
                playlistName, 
                userName, 
                songTitle, 
                songArtist, 
                songYear,
                sortBy,
                sortOrder 
            } = req.query;

            // Start with all playlists or user's playlists if logged in
            let playlists = [];
            if (userId) {
                // If logged in and no search criteria, show user's playlists
                if (!playlistName && !userName && !songTitle && !songArtist && !songYear) {
                    playlists = await this.databaseManager.readAll(this.playlist, { ownerId: userId });
                } else {
                    // Otherwise search all playlists
                    playlists = await this.databaseManager.readAll(this.playlist, {});
                }
            } else {
                // Guest users see all playlists when searching
                playlists = await this.databaseManager.readAll(this.playlist, {});
            }

            // Filter by playlist name (contains)
            if (playlistName) {
                playlists = playlists.filter(p => 
                    p.name.toLowerCase().includes(playlistName.toLowerCase())
                );
            }

            // Filter by user name (contains)
            if (userName) {
                const users = await this.databaseManager.readAll(this.user, {});
                const matchingUserIds = users
                    .filter(u => u.userName.toLowerCase().includes(userName.toLowerCase()))
                    .map(u => u.id);
                playlists = playlists.filter(p => matchingUserIds.includes(p.ownerId));
            }

            // Filter by song criteria
            if (songTitle || songArtist || songYear) {
                const allSongs = await this.databaseManager.readAll(this.song, {});
                let matchingSongIds = allSongs.map(s => s.id);

                if (songTitle) {
                    matchingSongIds = matchingSongIds.filter(id => {
                        const song = allSongs.find(s => s.id === id);
                        return song && song.title.toLowerCase().includes(songTitle.toLowerCase());
                    });
                }
                if (songArtist) {
                    matchingSongIds = matchingSongIds.filter(id => {
                        const song = allSongs.find(s => s.id === id);
                        return song && song.artist.toLowerCase().includes(songArtist.toLowerCase());
                    });
                }
                if (songYear) {
                    matchingSongIds = matchingSongIds.filter(id => {
                        const song = allSongs.find(s => s.id === id);
                        return song && song.year.toString().includes(songYear.toString());
                    });
                }

                // Get playlists that contain these songs
                const playlistSongs = await this.databaseManager.readAll(this.playlistSong, {});
                const playlistsWithSongs = new Set();
                playlistSongs.forEach(ps => {
                    if (matchingSongIds.includes(ps.songId)) {
                        playlistsWithSongs.add(ps.playlistId);
                    }
                });
                playlists = playlists.filter(p => playlistsWithSongs.has(p.id));
            }

            // Get listener counts and owner info for each playlist
            const playlistsWithDetails = await Promise.all(playlists.map(async (playlist) => {
                const owner = await this.databaseManager.readOneById(this.user, playlist.ownerId);
                const listeners = await this.databaseManager.readAll(this.playlistListener, { 
                    playlistId: playlist.id 
                });
                const uniqueListeners = new Set();
                listeners.forEach(l => {
                    if (l.userId) {
                        uniqueListeners.add(l.userId);
                    } else if (l.sessionId) {
                        uniqueListeners.add(l.sessionId);
                    }
                });

                return {
                    id: playlist.id,
                    name: playlist.name,
                    ownerId: playlist.ownerId,
                    ownerName: owner ? owner.userName : 'Unknown',
                    listenerCount: uniqueListeners.size
                };
            }));

            // Sort playlists
            if (sortBy) {
                playlistsWithDetails.sort((a, b) => {
                    let comparison = 0;
                    const order = sortOrder === 'asc' ? 1 : -1;

                    switch (sortBy) {
                        case 'listeners':
                            comparison = (a.listenerCount - b.listenerCount) * order;
                            break;
                        case 'name':
                            comparison = a.name.localeCompare(b.name) * order;
                            break;
                        case 'userName':
                            comparison = a.ownerName.localeCompare(b.ownerName) * order;
                            break;
                        default:
                            comparison = 0;
                    }
                    return comparison;
                });
            }

            return res.status(200).json({
                success: true,
                playlists: playlistsWithDetails
            });
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                success: false,
                errorMessage: err.message
            });
        }
    }

    getUserByPlaylistId = async (req, res) => {
        try {
            const playlistId = req.params.id;
            const resultPlaylist = await this.databaseManager.readOneById(this.playlist, playlistId);
            if (!resultPlaylist) {
                return res.status(404).json({
                    success: false,
                    errorMessage: "Playlist not found"
                });
            }
            const user = await this.databaseManager.readOneById(this.user, resultPlaylist.ownerId);

            return res.status(200).json({
                success: true,
                user: {
                    profileImage: user.profileImage,
                    userName: user.userName,
                    email: user.email,
                    userId: user.id
                }
            });
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                success: false,
                errorMessage: err.message
            });
        }
    }

    updatePlaylistName = async (req, res) => {
        try {
            const body = req.body;
            if (!body)
                return res.status(400).json({
                    success: false,
                    errorMessage: "Provide a body to update playlist!"
                });

            const list = await this.databaseManager.readOneById(this.playlist, req.params.id);
            if (!list) {
                return res.status(404).json({
                    success: false,
                    errorMessage: "Playlist not found"
                });
            }

            if (list.ownerId != req.userId)
                return res.status(403).json({
                    success: false,
                    errorMessage: "You can only update your own playlists!"
                });

            // Check for duplicate name for this user
            const existingPlaylists = await this.databaseManager.readAll(this.playlist, { 
                ownerId: req.userId,
                name: body.playlist.name 
            });
            if (existingPlaylists.length > 0 && existingPlaylists[0].id !== parseInt(req.params.id)) {
                return res.status(400).json({
                    success: false,
                    errorMessage: "You already have a playlist with this name."
                });
            }
            
            const newListToUpdateTo = {
                id: list.id,
                name: body.playlist.name,
            }
            const updatedPlaylist = await this.databaseManager.save(this.playlist, newListToUpdateTo);

            return res.status(200).json({
                success: true,
                playlist: {
                    id: updatedPlaylist.id,
                    name: updatedPlaylist.name,
                    ownerId: updatedPlaylist.ownerId
                }
            });
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                success: false,
                errorMessage: err.message
            });
        }
    }

    copyPlaylist = async (req, res) => {
        try {
            const playlistId = req.params.id;
            const userId = req.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    errorMessage: "You must be logged in to copy playlists"
                });
            }

            // Get original playlist
            const originalPlaylist = await this.databaseManager.readOneById(this.playlist, playlistId);
            if (!originalPlaylist) {
                return res.status(404).json({
                    success: false,
                    errorMessage: "Playlist not found"
                });
            }

            // Generate unique name
            let counter = 0;
            let newName = originalPlaylist.name + " (Copy)";
            let existingPlaylists = await this.databaseManager.readAll(this.playlist, { 
                ownerId: userId,
                name: newName 
            });
            while (existingPlaylists.length > 0) {
                counter++;
                newName = originalPlaylist.name + " (Copy " + counter + ")";
                existingPlaylists = await this.databaseManager.readAll(this.playlist, { 
                    ownerId: userId,
                    name: newName 
                });
            }

            // Create new playlist
            const newPlaylist = await this.databaseManager.save(this.playlist, {
                name: newName,
                ownerId: userId
            });

            // Get all songs from original playlist
            const playlistSongs = await this.databaseManager.readAll(this.playlistSong, { 
                playlistId: playlistId 
            });
            
            // Sort by order
            playlistSongs.sort((a, b) => a.order - b.order);

            // Deep copy: create new songs for each song in the playlist
            for (let i = 0; i < playlistSongs.length; i++) {
                const ps = playlistSongs[i];
                const originalSong = await this.databaseManager.readOneById(this.song, ps.songId);
                
                if (originalSong) {
                    // Create a new song (deep copy)
                    const newSong = await this.databaseManager.save(this.song, {
                        title: originalSong.title,
                        artist: originalSong.artist,
                        year: originalSong.year,
                        youTubeId: originalSong.youTubeId,
                        ownerId: userId // New owner is the copier
                    });

                    // Link to new playlist
                    await this.databaseManager.save(this.playlistSong, {
                        playlistId: newPlaylist.id,
                        songId: newSong.id,
                        order: i
                    });
                }
            }

            return res.status(201).json({
                success: true,
                playlist: {
                    id: newPlaylist.id,
                    name: newPlaylist.name,
                    ownerId: newPlaylist.ownerId
                }
            });
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                success: false,
                errorMessage: err.message
            });
        }
    }

    deletePlaylist = async (req, res) => {
        try {
            const playlistId = req.params.id;
            const userId = req.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    errorMessage: "You must be logged in to delete playlists"
                });
            }

            const playlist = await this.databaseManager.readOneById(this.playlist, playlistId);
            if (!playlist) {
                return res.status(404).json({
                    success: false,
                    errorMessage: "Playlist not found"
                });
            }

            if (playlist.ownerId != userId) {
                return res.status(403).json({
                    success: false,
                    errorMessage: "You can only delete your own playlists"
                });
            }

            // Delete playlist (cascade will handle related records)
            await this.databaseManager.deleteById(this.playlist, playlistId);

            return res.status(200).json({
                success: true
            });
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                success: false,
                errorMessage: err.message
            });
        }
    }

    recordPlaylistListen = async (req, res) => {
        try {
            const playlistId = req.params.id;
            const userId = auth.verifyUser(req);
            const sessionId = req.body.sessionId || null;

            // Check if already recorded for this user/session
            if (userId) {
                const existing = await this.databaseManager.readOne(this.playlistListener, {
                    playlistId: playlistId,
                    userId: userId
                });
                if (existing) {
                    return res.status(200).json({ success: true });
                }
                await this.databaseManager.save(this.playlistListener, {
                    playlistId: playlistId,
                    userId: userId
                });
            } else if (sessionId) {
                const existing = await this.databaseManager.readOne(this.playlistListener, {
                    playlistId: playlistId,
                    sessionId: sessionId
                });
                if (existing) {
                    return res.status(200).json({ success: true });
                }
                await this.databaseManager.save(this.playlistListener, {
                    playlistId: playlistId,
                    sessionId: sessionId
                });
            }

            return res.status(200).json({ success: true });
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                success: false,
                errorMessage: err.message
            });
        }
    }

}

const postgresDBManager = new PostgresDBManager();
const playlistController = new PlaylistController(
    postgresDBManager, 
    Playlist, 
    User, 
    Song, 
    PlaylistSong, 
    PlaylistListener
);
module.exports = playlistController;

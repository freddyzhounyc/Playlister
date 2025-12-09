const PostgresDBManager = require('../db/impl/PostgresDBManager');
const { Song, User, PlaylistSong } = require('../db/models/index');
const { Sequelize } = require('sequelize');
const auth = require('../auth/index');

class SongController {

    // Dependency Injection
    constructor(databaseManager, song, user, playlistSong) {
        this.databaseManager = databaseManager;
        this.song = song;
        this.user = user;
        this.playlistSong = playlistSong;
    }

    createSong = async (req, res) => {
        try {
            if (!req.body)
                return res.status(400).json({
                    success: false,
                    error: 'You must provide a Song'
                });

            const { title, artist, year, youTubeId, ownerId } = req.body;

            // Check for duplicate (title, artist, year combination must be unique)
            const existingSong = await this.databaseManager.readOne(this.song, {
                title: title,
                artist: artist,
                year: year
            });
            if (existingSong) {
                return res.status(400).json({
                    success: false,
                    errorMessage: "A song with this title, artist, and year already exists."
                });
            }

            const song = await this.databaseManager.save(this.song, { 
                title, 
                artist, 
                year, 
                youTubeId, 
                ownerId 
            });
            return res.status(201).json({
                success: true,
                song: {
                    id: song.id,
                    title: song.title,
                    artist: song.artist,
                    year: song.year,
                    youTubeId: song.youTubeId,
                    ownerId: song.ownerId
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

    getSongById = async (req, res) => {
        try {
            const song = await this.databaseManager.readOneById(this.song, req.params.id);
            if (!song) {
                return res.status(404).json({
                    success: false,
                    errorMessage: "Song not found"
                });
            }
            
            return res.status(200).json({
                success: true,
                song: {
                    id: song.id,
                    title: song.title,
                    artist: song.artist,
                    year: song.year,
                    youTubeId: song.youTubeId,
                    ownerId: song.ownerId
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

    getSongs = async (req, res) => {
        try {
            const userId = auth.verifyUser(req);
            const { 
                title, 
                artist, 
                year, 
                ownerId,
                sortBy,
                sortOrder 
            } = req.query;

            // Get all songs or filter by owner if specified
            let songs = [];
            if (ownerId) {
                songs = await this.databaseManager.readAll(this.song, { ownerId: parseInt(ownerId) });
            } else if (userId && !title && !artist && !year) {
                // If logged in and no search, show user's songs
                songs = await this.databaseManager.readAll(this.song, { ownerId: userId });
            } else {
                // Otherwise get all songs for searching
                songs = await this.databaseManager.readAll(this.song, {});
            }

            // Filter by title (contains)
            if (title) {
                songs = songs.filter(s => 
                    s.title.toLowerCase().includes(title.toLowerCase())
                );
            }

            // Filter by artist (contains)
            if (artist) {
                songs = songs.filter(s => 
                    s.artist.toLowerCase().includes(artist.toLowerCase())
                );
            }

            // Filter by year (contains)
            if (year) {
                songs = songs.filter(s => 
                    s.year.toString().includes(year.toString())
                );
            }

            songs = songs.filter(s => 
                !s.title.includes("(Copy)")
            );

            // Get statistics for each song
            const songsWithStats = await Promise.all(songs.map(async (song) => {
                // Get playlist count
                const playlistSongs = await this.databaseManager.readAll(this.playlistSong, {
                    songId: song.id
                });
                const uniquePlaylists = new Set(playlistSongs.map(ps => ps.playlistId));
                
                // Get listen count (for now, we'll use playlist count as a proxy)
                // In a real app, you'd track actual listens
                const listenCount = uniquePlaylists.size * 10; // Placeholder

                return {
                    id: song.id,
                    title: song.title,
                    artist: song.artist,
                    year: song.year,
                    youTubeId: song.youTubeId,
                    ownerId: song.ownerId,
                    playlistCount: uniquePlaylists.size,
                    listenCount: listenCount
                };
            }));

            // Sort songs
            if (sortBy) {
                songsWithStats.sort((a, b) => {
                    let comparison = 0;
                    const order = sortOrder === 'asc' ? 1 : -1;

                    switch (sortBy) {
                        case 'listens':
                            comparison = (a.listenCount - b.listenCount) * order;
                            break;
                        case 'playlists':
                            comparison = (a.playlistCount - b.playlistCount) * order;
                            break;
                        case 'title':
                            comparison = a.title.localeCompare(b.title) * order;
                            break;
                        case 'artist':
                            comparison = a.artist.localeCompare(b.artist) * order;
                            break;
                        case 'year':
                            comparison = (a.year - b.year) * order;
                            break;
                        default:
                            comparison = 0;
                    }
                    return comparison;
                });
            }

            return res.status(200).json({
                success: true,
                songs: songsWithStats
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                errorMessage: err.message
            });
        }
    }

    updateSong = async (req, res) => {
        try {
            const songId = req.params.id;
            const userId = req.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    errorMessage: "You must be logged in to edit songs"
                });
            }

            const song = await this.databaseManager.readOneById(this.song, songId);
            if (!song) {
                return res.status(404).json({
                    success: false,
                    errorMessage: "Song not found"
                });
            }

            if (song.ownerId != userId) {
                return res.status(403).json({
                    success: false,
                    errorMessage: "You can only edit your own songs"
                });
            }

            const { title, artist, year, youTubeId } = req.body;

            // Check for duplicate if title/artist/year changed
            if (title !== song.title || artist !== song.artist || year !== song.year) {
                const existingSong = await this.databaseManager.readOne(this.song, {
                    title: title,
                    artist: artist,
                    year: year
                });
                if (existingSong && existingSong.id !== parseInt(songId)) {
                    return res.status(400).json({
                        success: false,
                        errorMessage: "A song with this title, artist, and year already exists."
                    });
                }
            }

            const updatedSong = await this.databaseManager.save(this.song, {
                id: songId,
                title: title || song.title,
                artist: artist || song.artist,
                year: year || song.year,
                youTubeId: youTubeId || song.youTubeId,
                ownerId: song.ownerId
            });

            return res.status(200).json({
                success: true,
                song: {
                    id: updatedSong.id,
                    title: updatedSong.title,
                    artist: updatedSong.artist,
                    year: updatedSong.year,
                    youTubeId: updatedSong.youTubeId,
                    ownerId: updatedSong.ownerId
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

    deleteSongById = async (req, res) => {
        try {
            const song = await this.databaseManager.readOneById(this.song, req.params.id);
            if (!song) {
                return res.status(404).json({
                    success: false,
                    errorMessage: "Song not found"
                });
            }

            if (song.ownerId != req.userId) {
                return res.status(403).json({
                    success: false,
                    errorMessage: "You can only delete your own songs!"
                });
            }

            // Delete song (cascade will handle playlist songs)
            await this.databaseManager.deleteById(this.song, req.params.id);

            return res.status(200).json({
                success: true
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                errorMessage: err.message
            });
        }
    }

}

const postgresDBManager = new PostgresDBManager();
const songController = new SongController(postgresDBManager, Song, User, PlaylistSong);
module.exports = songController;

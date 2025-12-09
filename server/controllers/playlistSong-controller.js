const PostgresDBManager = require('../db/impl/PostgresDBManager');
const { PlaylistSong } = require('../db/models/index');

class PlaylistSongController {

    // Dependency Injection
    constructor(databaseManager, playlistSong) {
        this.databaseManager = databaseManager;
        this.playlistSong = playlistSong;
    }

    createPlaylistSong = async (req, res) => {
        try {
            if (!req.body)
                return res.status(400).json({
                    success: false,
                    error: 'You must provide a PlaylistSong'
                });
            const playlistSong = await this.databaseManager.save(this.playlistSong, { 
                playlistId: req.body.playlistId, 
                songId: req.body.songId, 
                order: req.body.order 
            });
            return res.status(201).json({
                success: true,
                playlistSong: {
                    playlistId: playlistSong.playlistId,
                    songId: playlistSong.songId,
                    order: playlistSong.order
                }
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                errorMessage: err.message
            });
        }
    }
    getSongsInPlaylist = async (req, res) => {
        try {
            const playlistSongs = await this.databaseManager.readAll(this.playlistSong, { playlistId: req.params.id });

            const songIds = [];
            for (let key in playlistSongs) {
                songIds[playlistSongs[key].order] = playlistSongs[key].songId;
            }
            return res.status(200).json({
                success: true,
                songIds: songIds
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                errorMessage: err.message
            });
        }
    }

    deletePlaylistSong = async (req, res) => {
        try {
            const { playlistId, songId } = req.params;
            
            const playlistSong = await this.databaseManager.readOne(this.playlistSong, {
                playlistId: parseInt(playlistId),
                songId: parseInt(songId)
            });

            if (!playlistSong) {
                return res.status(404).json({
                    success: false,
                    errorMessage: "Song not found in playlist"
                });
            }

            await this.databaseManager.deleteById(this.playlistSong, playlistSong.id);

            return res.status(200).json({
                success: true
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                errorMessage: err.message
            });
        }
    }

    updatePlaylistSongOrders = async (req, res) => {
        try {
            const { playlistId } = req.params;
            const { songOrders } = req.body;

            if (!songOrders || !Array.isArray(songOrders)) {
                return res.status(400).json({
                    success: false,
                    errorMessage: "You must provide an array of songOrders"
                });
            }

            for (const songOrder of songOrders) {
                const playlistSong = await this.databaseManager.readOne(this.playlistSong, {
                    playlistId: parseInt(playlistId),
                    songId: parseInt(songOrder.songId)
                });

                if (playlistSong) {
                    await this.databaseManager.save(this.playlistSong, {
                        id: playlistSong.id,
                        playlistId: playlistSong.playlistId,
                        songId: playlistSong.songId,
                        order: songOrder.order
                    });
                }
            }

            return res.status(200).json({
                success: true
            });
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
const playlistSongController = new PlaylistSongController(postgresDBManager, PlaylistSong);
module.exports = playlistSongController;
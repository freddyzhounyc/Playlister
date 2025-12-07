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
            const playlistSong = this.databaseManager.save(this.playlistSong, { playlistId: req.body.playlistId, songId: req.body.songId, order: req.body.order });
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
            res.status(500).json({
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

}
const postgresDBManager = new PostgresDBManager();
const playlistSongController = new PlaylistSongController(postgresDBManager, PlaylistSong);
module.exports = playlistSongController;
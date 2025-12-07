const PostgresDBManager = require('../db/impl/PostgresDBManager');
const { Song } = require('../db/models/index');

class SongController {

    // Dependency Injection
    constructor(databaseManager, song) {
        this.databaseManager = databaseManager;
        this.song = song;
    }

    createSong = async (req, res) => {
        try {
            if (!req.body)
                return res.status(400).json({
                    success: false,
                    error: 'You must provide a Song'
                });
            const song = await this.databaseManager.save(this.song, { title: req.body.title, artist: req.body.artist, year: req.body.year, youTubeId: req.body.youTubeId });
            return res.status(201).json({
                success: true,
                song: {
                    title: song.title,
                    artist: song.artist,
                    year: song.year,
                    youTubeId: song.youTubeId
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
            
            return res.status(200).json({
                success: true,
                song: {
                    id: song.id,
                    title: song.title,
                    artist: song.artist,
                    year: song.year,
                    youTubeId: song.youTubeId
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

}
const postgresDBManager = new PostgresDBManager();
const songController = new SongController(postgresDBManager, Song);
module.exports = songController;
const PostgresDBManager = require('../db/impl/PostgresDBManager');
const { Song, User, PlaylistSong } = require('../db/models/index');

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
            const song = await this.databaseManager.save(this.song, { title: req.body.title, artist: req.body.artist, year: req.body.year, youTubeId: req.body.youTubeId, ownerId: req.body.ownerId });
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
            const { title, artist, year, ownerId } = req.query;
            let criteria = {}
            if (title)
                criteria = {...criteria, title: title}
            if (artist)
                criteria = {...criteria, artist: artist}
            if (year)
                criteria = {...criteria, year: year}
            if (ownerId)
                criteria = {...criteria, ownerId: ownerId}

            const songs = await this.databaseManager.readAll(this.song, criteria);

            return res.status(200).json({
                success: true,
                songs: songs
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                errorMessage: err.message
            });
        }
    }
    deleteSongById = async (req, res) => {
        try {
            const song = await this.databaseManager.readOneById(this.song, req.params.id);
            const user = await this.databaseManager.readOne(this.user, { id: song.ownerId });
            if (user.id != req.userId)
                return res.status(400).json({
                    success: false,
                    errorMessage: "You can only delete your own songs!"
                });

            await this.databaseManager.deleteById(this.song, req.params.id);

            // const playlistSongs = await this.databaseManager.readAll(this.playlistSong, { playlistId: req.body.playlistId });
            // const songIds = [];
            // for (let key in playlistSongs) {
            //     if (playlistSongs[key])
            //         songIds[playlistSongs[key].order] = playlistSongs[key];
            // }
            // let isAGap = false;
            // let i = 0;
            // for (i = 0; i < songIds.length; i++) {
            //     if (!songIds[i]) {
            //         isAGap = true;
            //         break;
            //     }
            // }
            // i += 1;
            // if (isAGap) {
            //     while (i < songIds.length) {
            //         songIds[i].order--;
            //         await this.databaseManager.save(this.playlistSong, { playlistId: songIds[i].playlistId, songId: songIds[i].songId, order: songIds[i].order });
            //         i++;
            //     }
            // }

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
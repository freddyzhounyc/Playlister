const PostgresDBManager = require('../db/impl/PostgresDBManager');
const { Playlist, User } = require('../db/models/index');
const auth = require('../auth/index');

class PlaylistController {

    // Dependency Injection
    constructor(databaseManager, playlist, user) {
        this.databaseManager = databaseManager;
        this.playlist = playlist;
        this.user = user;
    }

    createPlaylist = async (req, res) => {
        try {
            if (!req.body)
                return res.status(400).json({
                    success: false,
                    error: 'You must provide a Playlist'
                });
            let playlist = await this.databaseManager.save(this.playlist, { name: req.body.name, ownerId: req.body.ownerId });
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
            res.status(200).json({
                success: true,
                idNamePairs: []
            });
        
        try {
            // Registered Users
            let user = await this.databaseManager.readOneById(this.user, userId);
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
            const { name, ownerId } = req.query;
            let criteria = {};
            if (name)
                criteria = {...criteria, name: name}
            if (ownerId)
                criteria = {...criteria, ownerId: ownerId}

            const playlists = await this.databaseManager.readAll(this.playlist, criteria);

            return res.status(200).json({
                success: true,
                playlists: playlists
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
            const user = await this.databaseManager.readOne(this.user, { id: list.ownerId });
            console.log(user.id + " " + req.userId)
            if (user.id != req.userId)
                return res.status(400).json({
                    success: false,
                    errorMessage: "You can only update your own playlists!"
                });
            
            const newListToUpdateTo = {
                id: list.id,
                name: body.playlist.name,
            }
            const updatedPlaylist = await this.databaseManager.save(this.playlist, newListToUpdateTo); // Update

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

}
const postgresDBManager = new PostgresDBManager();
const playlistController = new PlaylistController(postgresDBManager, Playlist, User);
module.exports = playlistController;
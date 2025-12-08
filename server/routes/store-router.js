const express = require('express');
const router = express.Router();
const auth = require('../auth/index');
const UserController = require('../controllers/user-controller');
const PlaylistController = require('../controllers/playlist-controller');
const SongController = require('../controllers/song-controller');
const PlaylistSongController = require('../controllers/playlistSong-controller');

// User Controller
router.put("/user/:id", auth.verify, UserController.updateUser);

// Playlist Controller
router.get("/playlistpairs", PlaylistController.getPlaylistPairs); // Public Endpoint
router.get("/userByPlaylistId/:id", PlaylistController.getUserByPlaylistId); // Public Endpoint
router.post("/playlist", auth.verify, PlaylistController.createPlaylist);
router.get("/playlist/:id", PlaylistController.getPlaylistById) // Public Endpoint
router.get("/playlists", PlaylistController.getPlaylists) // Public Endpoint
router.put("/playlist/:id", auth.verify, PlaylistController.updatePlaylistName);

// PlaylistSong Controller
router.get("/songsInPlaylist/:id", PlaylistSongController.getSongsInPlaylist) // Public Endpoint
router.post("/playlistSong", auth.verify, PlaylistSongController.createPlaylistSong);

// Song Controller
router.post("/song", auth.verify, SongController.createSong);
router.get("/song/:id", auth.verify, SongController.getSongById);

module.exports = router;
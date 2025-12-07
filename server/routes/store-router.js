const express = require('express');
const router = express.Router();
const auth = require('../auth/index');
const UserController = require('../controllers/user-controller');
const PlaylistController = require('../controllers/playlist-controller');

router.put("/user/:id", auth.verify, UserController.updateUser);
router.get("/playlistpairs", PlaylistController.getPlaylistPairs); // Public Endpoint
router.get("/userByPlaylistId/:id", PlaylistController.getUserByPlaylistId); // Public Endpoint
router.post("/playlist", auth.verify, PlaylistController.createPlaylist);

module.exports = router;
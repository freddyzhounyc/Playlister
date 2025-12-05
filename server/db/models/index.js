const User = require('./user-model');
const Playlist = require('./playlist-model');
const Song = require('./song-model');
const PlaylistSong = require('./PlaylistSong-model');

User.hasMany(Playlist, {
    foreignKey: "ownerId",
    as: "playlists",
    onDelete: "CASCADE"
});
Playlist.belongsTo(User, {
    foreignKey: "ownerId",
    as: "owner"
});

Playlist.belongsToMany(Song, {
    through: PlaylistSong,
    foreignKey: "playlistId",
    otherKey: "songId",
    as: "songs"
});
Song.belongsToMany(Playlist, {
    through: PlaylistSong,
    foreignKey: "songId",
    otherKey: "playlistId",
    as: "playlists"
});

module.exports = {
    User,
    Playlist,
    Song,
    PlaylistSong
}
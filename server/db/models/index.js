const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({
    path: __dirname + "/../../../.env"
});

const sequelize = new Sequelize(process.env.POSTGRES_DB_CONNECT);

const User = require('./user-model')(sequelize);
const Playlist = require('./playlist-model')(sequelize);
const Song = require('./song-model')(sequelize);
const PlaylistSong = require('./PlaylistSong-model')(sequelize);
const PlaylistListener = require('./playlistListener-model')(sequelize);

User.hasMany(Playlist, {
    foreignKey: "ownerId",
    as: "playlists",
    onDelete: "CASCADE"
});
Playlist.belongsTo(User, {
    foreignKey: "ownerId",
    as: "owner"
});

User.hasMany(Song, {
    foreignKey: "ownerId",
    as: "songs",
    onDelete: "CASCADE"
})
Song.belongsTo(User, {
    foreignKey: "ownerId",
    as: "owner"
})

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

Playlist.hasMany(PlaylistListener, {
    foreignKey: "playlistId",
    as: "listeners",
    onDelete: "CASCADE"
});
PlaylistListener.belongsTo(Playlist, {
    foreignKey: "playlistId",
    as: "playlist"
});

User.hasMany(PlaylistListener, {
    foreignKey: "userId",
    as: "playlistListeners",
    onDelete: "CASCADE"
});
PlaylistListener.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
});

const initializeDB = async () => {
    await sequelize.sync();
}

module.exports = {
    User,
    Playlist,
    Song,
    PlaylistSong,
    PlaylistListener,
    initializeDB
}
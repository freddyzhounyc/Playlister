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

const initializeDB = async () => {
    await sequelize.sync();
}

module.exports = {
    User,
    Playlist,
    Song,
    PlaylistSong,
    initializeDB
}
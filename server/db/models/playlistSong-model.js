const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({
    path: __dirname + "/../../../.env"
});

const sequelize = new Sequelize(process.env.POSTGRES_DB_CONNECT);

const PlaylistSong = sequelize.define("PlaylistSong", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    playlistId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "playlists",
            key: "id"
        },
        onDelete: "CASCADE"
    },
    songId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "songs",
            key: "id"
        },
        onDelete: "CASCADE"
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true
})

module.exports = PlaylistSong;
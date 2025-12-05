const { DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({
    path: __dirname + "/../../../.env"
});

const createPlaylistSong = (sequelize) => {
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
    });

    return PlaylistSong;
}

module.exports = createPlaylistSong;
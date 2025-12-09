const { DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({
    path: __dirname + "/../../../.env"
});

const createPlaylistListener = (sequelize) => {
    const PlaylistListener = sequelize.define("PlaylistListener", {
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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true, // null for guest users
            references: {
                model: "users",
                key: "id"
            },
            onDelete: "CASCADE"
        },
        sessionId: {
            type: DataTypes.STRING,
            allowNull: true // for tracking guest sessions
        }
    }, {
        timestamps: true
    });

    return PlaylistListener;
}

module.exports = createPlaylistListener;

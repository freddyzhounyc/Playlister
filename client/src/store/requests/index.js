const serverStoreUrl = "http://localhost:4000/api";

// User Controller
export const updateUser = async (id, profileImage, userName, email, password, passwordVerify) => {
    const response = await fetch(serverStoreUrl + "/user/" + id, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            profileImage: profileImage,
            userName: userName,
            email: email,
            password: password,
            passwordVerify: passwordVerify
        })
    });
    return response;
}

// Playlist Controller
export const createPlaylist = async (newListName, ownerId) => {
    const response = await fetch(serverStoreUrl + "/playlist", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: newListName,
            ownerId: ownerId
        })
    });
    return response;
}

export const getPlaylistById = async (playlistId) => {
    const response = await fetch(serverStoreUrl + "/playlist/" + playlistId, {
        method: "GET",
        credentials: "include"
    })
    return response;
}

export const getAllPlaylistsByName = async (name) => {
    const response = await fetch(serverStoreUrl + "/playlists?" + "playlistName=" + encodeURIComponent(name), {
        method: "GET",
        credentials: "include"
    });
    return response;
}

export const getPlaylistPairs = async () => {
    const response = await fetch(serverStoreUrl + "/playlistpairs", {
        method: "GET",
        credentials: "include"
    });
    return response;
}

export const getPlaylists = async (queryString = "") => {
    const url = serverStoreUrl + "/playlists" + (queryString ? "?" + queryString : "");
    const response = await fetch(url, {
        method: "GET",
        credentials: "include"
    });
    return response;
}

export const getUserByPlaylistId = async (playlistId) => {
    const response = await fetch(serverStoreUrl + "/userByPlaylistId/" + playlistId, {
        method: "GET",
        credentials: "include"
    });
    return response;
}

export const updatePlaylistNameById = async (id, playlist) => {
    const response = await fetch(serverStoreUrl + "/playlist/" + id, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            playlist: {
                name: playlist.name,
            }
        })
    });
    return response;
}

export const copyPlaylist = async (playlistId) => {
    const response = await fetch(serverStoreUrl + "/playlist/" + playlistId + "/copy", {
        method: "POST",
        credentials: "include"
    });
    return response;
}

export const deletePlaylist = async (playlistId) => {
    const response = await fetch(serverStoreUrl + "/playlist/" + playlistId, {
        method: "DELETE",
        credentials: "include"
    });
    return response;
}

export const recordPlaylistListen = async (playlistId, userId) => {
    const response = await fetch(serverStoreUrl + "/playlist/" + playlistId + "/listen", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sessionId: userId ? null : `guest_${Date.now()}_${Math.random()}`
        })
    });
    return response;
}

// PlaylistSong Controller
export const createPlaylistSong = async (playlistSong) => {
    const response = await fetch(serverStoreUrl + "/playlistSong", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            playlistId: playlistSong.playlistId,
            songId: playlistSong.songId,
            order: playlistSong.order
        })
    });
    return response;
}

export const getSongsInPlaylist = async (playlistId) => {
    const response = await fetch(serverStoreUrl + "/songsInPlaylist/" + playlistId, {
        method: "GET",
        credentials: "include"
    });
    return response;
}

export const deletePlaylistSong = async (playlistId, songId) => {
    const response = await fetch(serverStoreUrl + "/playlist/" + playlistId + "/song/" + songId, {
        method: "DELETE",
        credentials: "include"
    });
    return response;
}

export const updatePlaylistSongOrders = async (playlistId, songOrders) => {
    const response = await fetch(serverStoreUrl + "/playlist/" + playlistId + "/songOrders", {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            songOrders: songOrders
        })
    });
    return response;
}

// Song Controller
export const createSong = async (newSong) => {
    const response = await fetch(serverStoreUrl + "/song", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: newSong.title,
            artist: newSong.artist,
            year: newSong.year,
            youTubeId: newSong.youTubeId,
            ownerId: newSong.ownerId
        })
    });
    return response;
}

export const getSongs = async (queryString = "") => {
    const url = serverStoreUrl + "/songs" + (queryString ? "?" + queryString : "");
    const response = await fetch(url, {
        method: "GET",
        credentials: "include"
    });
    return response;
}

export const getSongById = async (songId) => {
    const response = await fetch(serverStoreUrl + "/song/" + songId, {
        method: "GET",
        credentials: "include"
    });
    return response;
}

export const updateSong = async (songId, updatedSong) => {
    const response = await fetch(serverStoreUrl + "/song/" + songId, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: updatedSong.title,
            artist: updatedSong.artist,
            year: updatedSong.year,
            youTubeId: updatedSong.youTubeId
        })
    });
    return response;
}

export const deleteSongById = async (songId, playlistId) => {
    const response = await fetch(serverStoreUrl + "/song/" + songId, {
        method: "DELETE",
        credentials: "include"
    });
    return response;
}

const apis = {
    updateUser,
    createPlaylist,
    getPlaylistById,
    getAllPlaylistsByName,
    getPlaylistPairs,
    getPlaylists,
    getUserByPlaylistId,
    updatePlaylistNameById,
    copyPlaylist,
    deletePlaylist,
    recordPlaylistListen,
    createPlaylistSong,
    getSongsInPlaylist,
    deletePlaylistSong,
    updatePlaylistSongOrders,
    createSong,
    getSongs,
    getSongById,
    updateSong,
    deleteSongById
}
export default apis;

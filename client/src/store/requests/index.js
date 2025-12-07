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
    const response = await fetch(serverStoreUrl + "/playlists?" + "name=" + name, {
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
export const getUserByPlaylistId = async (playlistId) => {
    const response = await fetch(serverStoreUrl + "/userByPlaylistId/" + playlistId, {
        method: "GET",
        credentials: "include"
    });
    return response;
}

// PlaylistSong Controller
export const getSongsInPlaylist = async (playlistId) => {
    const response = await fetch(serverStoreUrl + "/songsInPlaylist/" + playlistId, {
        method: "GET",
        credentials: "include"
    });
    return response;
}

// Song Controller
export const getSongById = async (songId) => {
    const response = await fetch(serverStoreUrl + "/song/" + songId, {
        method: "GET",
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
    getUserByPlaylistId,
    getSongsInPlaylist,
    getSongById
}
export default apis;
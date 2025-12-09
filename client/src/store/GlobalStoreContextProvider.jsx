import { useState, useContext, createContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsTPS } from "jstps";
import AuthContext from '../auth/AuthContextProvider';
import storeRequestSender from './requests/index';
import CreateSong_Transaction from '../transactions/CreateSong_Transaction';
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction';
import MoveSong_Transaction from '../transactions/MoveSong_Transaction';

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    UPDATE_USER: "UPDATE_USER",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_PLAYLISTS: "LOAD_PLAYLISTS",
    HIDE_MODALS: "HIDE_MODALS",
    PLAY_PLAYLIST: "PLAY_PLAYLIST",
    EDIT_PLAYLIST: "EDIT_PLAYLIST",
    UPDATE_CURRENT_LIST: "UPDATE_CURRENT_LIST",
    CREATE_SONG: "CREATE_SONG",
    DELETE_SONG: "DELETE_SONG",
    LOAD_SONGS: "LOAD_SONGS",
    SET_CURRENT_SONG: "SET_CURRENT_SONG",
    MARK_PLAYLIST_FOR_DELETION: "MARK_PLAYLIST_FOR_DELETION",
    MARK_SONG_FOR_DELETION: "MARK_SONG_FOR_DELETION"
}

const tps = new jsTPS();
let pendingOperations = new Set();

const CurrentModal = {
    NONE : "NONE",
    DELETE_PLAYLIST : "DELETE_PLAYLIST",
    DELETE_SONG : "DELETE_SONG",
    EDIT_SONG : "EDIT_SONG",
    EDIT_PLAYLIST_MODAL: "EDIT_PLAYLIST_MODAL",
    PLAY_PLAYLIST_MODAL: "PLAY_PLAYLIST_MODAL",
    ERROR : "ERROR"
}

function GlobalStoreContextProvider(props) {
    const { auth } = useContext(AuthContext);
    const [store, setStore] = useState({
        currentModal: CurrentModal.NONE,
        playlists: [], // Array of playlists with details
        currentPlayingList: null,
        currentList: null, // List currently being edited
        currentSongIndex : -1,
        currentSong : null, // Song currently being edited
        songs: [], // Songs in catalog
        playlistMarkedForDeletion: null,
        songMarkedForDeletion: null,
        searchCriteria: {
            playlistName: "",
            userName: "",
            songTitle: "",
            songArtist: "",
            songYear: ""
        },
        sortCriteria: {
            type: "listeners",
            order: "desc" // "desc" for Hi-Lo, "asc" for Lo-Hi
        }
    });
    const navigate = useNavigate();

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.UPDATE_USER: {
                return setStore({
                    ...store,
                    currentModal: CurrentModal.NONE
                });
            }
            case GlobalStoreActionType.LOAD_PLAYLISTS: {
                return setStore({
                    ...store,
                    playlists: payload.playlists || [],
                    currentModal: CurrentModal.NONE
                });
            }
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    ...store,
                    currentModal: CurrentModal.EDIT_PLAYLIST_MODAL,
                    currentList: payload.playlist
                })
            }
            case GlobalStoreActionType.PLAY_PLAYLIST: {
                return setStore({
                    ...store,
                    currentModal: CurrentModal.PLAY_PLAYLIST_MODAL,
                    currentPlayingList: payload.playlist,
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    ...store,
                    currentModal : CurrentModal.NONE,
                    currentList: null,
                    currentSong: null,
                    currentSongIndex: -1,
                    playlistMarkedForDeletion: null,
                    songMarkedForDeletion: null
                });
            }
            case GlobalStoreActionType.EDIT_PLAYLIST: {
                return setStore({
                    ...store,
                    currentModal: CurrentModal.EDIT_PLAYLIST_MODAL,
                    currentList: payload.playlist
                });
            }
            case GlobalStoreActionType.UPDATE_CURRENT_LIST: {
                return setStore({
                    ...store,
                    currentList: payload.playlist || null,
                    currentModal: payload.playlist ? CurrentModal.EDIT_PLAYLIST_MODAL : CurrentModal.NONE
                });
            }
            case GlobalStoreActionType.CREATE_SONG: {
                return setStore({
                    ...store,
                    currentList: payload.newCurrentList
                });
            }
            case GlobalStoreActionType.DELETE_SONG: {
                return setStore({
                    ...store,
                    currentList: payload.newCurrentList
                });
            }
            case GlobalStoreActionType.LOAD_SONGS: {
                return setStore({
                    ...store,
                    songs: payload.songs || []
                });
            }
            case GlobalStoreActionType.SET_CURRENT_SONG: {
                const isNullSong = (payload.song === null || payload.song === undefined) && payload.index === -1;
                const isCurrentlyOpen = store.currentModal === CurrentModal.EDIT_SONG;
                const shouldClose = isNullSong && isCurrentlyOpen;
                
                return setStore({
                    ...store,
                    currentSong: payload.song,
                    currentSongIndex: payload.index,
                    currentModal: shouldClose ? CurrentModal.NONE : CurrentModal.EDIT_SONG
                });
            }
            case GlobalStoreActionType.MARK_PLAYLIST_FOR_DELETION: {
                return setStore({
                    ...store,
                    currentModal: CurrentModal.DELETE_PLAYLIST,
                    playlistMarkedForDeletion: payload.playlist
                });
            }
            case GlobalStoreActionType.MARK_SONG_FOR_DELETION: {
                return setStore({
                    ...store,
                    currentModal: CurrentModal.DELETE_SONG,
                    songMarkedForDeletion: payload.song
                });
            }
            default:
                return store;
        }
    }

    store.updateUser = async (newUpdateUser) => {
        try {
            const { profileImage, userName, email, password, passwordVerify } = newUpdateUser;
            const response = await storeRequestSender.updateUser(auth.user.userId, profileImage, userName, email, password, passwordVerify);
            const data = await response.json();
            if (response.status === 200) {
                storeReducer({
                    type: GlobalStoreActionType.UPDATE_USER,
                    payload: null
                });
                auth.updateUser(data.user, null);
                navigate(-1);
            } else
                throw new Error(data.errorMessage);
        } catch (err) {
            auth.updateUser(null, err.message);
        }
    }

    store.createNewList = async () => {
        try {
            let counter = 0;
            let newListName = "Untitled" + counter;
            let playlistsWithSelectedNewName = [];
            do {
                const response = await storeRequestSender.getAllPlaylistsByName(newListName);
                const data = await response.json();
                playlistsWithSelectedNewName = data.playlists || [];
                if (playlistsWithSelectedNewName.length > 0)
                    counter++;
                newListName = "Untitled" + counter;
            } while (playlistsWithSelectedNewName.length > 0);
            
            const response = await storeRequestSender.createPlaylist(newListName, auth.user.userId);
            const data = await response.json();

            if (response.status === 201) {
                tps.clearAllTransactions();
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: { playlist: data.playlist }
                });
                await store.loadPlaylists();
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    store.loadPlaylists = async (searchCriteria = null, sortCriteria = null) => {
        try {
            const criteria = searchCriteria || store.searchCriteria;
            const sort = sortCriteria || store.sortCriteria;
            
            const params = new URLSearchParams();
            if (criteria.playlistName) params.append('playlistName', criteria.playlistName);
            if (criteria.userName) params.append('userName', criteria.userName);
            if (criteria.songTitle) params.append('songTitle', criteria.songTitle);
            if (criteria.songArtist) params.append('songArtist', criteria.songArtist);
            if (criteria.songYear) params.append('songYear', criteria.songYear);
            if (sort.type) params.append('sortBy', sort.type);
            if (sort.order) params.append('sortOrder', sort.order === 'desc' ? 'desc' : 'asc');

            const response = await storeRequestSender.getPlaylists(params.toString());
            const data = await response.json();
            if (data.success) {
                storeReducer({
                    type: GlobalStoreActionType.LOAD_PLAYLISTS,
                    payload: { playlists: data.playlists }
                });
            } else
                throw new Error("FAILED TO GET PLAYLISTS");
        } catch (err) {
            console.log(err.message);
        }
    }

    store.searchPlaylists = async (criteria) => {
        setStore(prev => ({
            ...prev,
            searchCriteria: { ...prev.searchCriteria, ...criteria }
        }));
        await store.loadPlaylists(criteria, null);
    }

    store.sortPlaylists = async (sortType, sortOrder) => {
        const newSort = { type: sortType, order: sortOrder };
        setStore(prev => ({
            ...prev,
            sortCriteria: newSort
        }));
        await store.loadPlaylists(null, newSort);
    }

    store.clearPlaylistSearch = async () => {
        const emptyCriteria = {
            playlistName: "",
            userName: "",
            songTitle: "",
            songArtist: "",
            songYear: ""
        };
        setStore(prev => ({
            ...prev,
            searchCriteria: emptyCriteria
        }));
        await store.loadPlaylists(emptyCriteria, null);
    }

    store.getUserByPlaylistId = async (playlistId) => {
        try {
            const response = await storeRequestSender.getUserByPlaylistId(playlistId);
            const data = await response.json();
            if (data.success)
                return data.user;
            else
                throw new Error("Failed to get User by Playlist ID");
        } catch (err) {
            console.log(err.message);
            return null;
        }
    }

    store.getSongsInPlaylist = async (playlistId) => {
        try {
            const response = await storeRequestSender.getSongsInPlaylist(playlistId);
            const data = await response.json();
            if (data.success)
                return data.songIds;
            else
                throw new Error("Failed to get Songs in a particular playlist.");
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    store.getSongById = async (songId) => {
        try {
            const response = await storeRequestSender.getSongById(songId);
            const data = await response.json();
            if (data.success)
                return data.song;
            else {
                return null;
            }
        } catch (err) {
            if (!err.message.includes("404")) {
                console.log(err.message);
            }
            return null;
        }
    }

    store.showPlayPlaylistModal = async (playlistId) => {
        try {
            const response = await storeRequestSender.getPlaylistById(playlistId);
                const data = await response.json();
                if (data.success) {
                    await storeRequestSender.recordPlaylistListen(playlistId, auth.user?.userId || null);
                
                storeReducer({
                    type: GlobalStoreActionType.PLAY_PLAYLIST,
                    payload: {playlist: data.playlist}
                });
            } else
                throw new Error("Failed to play playlist!");
        } catch (err) {
            console.log(err.message);
        }
    }

    store.showEditPlaylistModal = async (playlistId) => {
        try {
            tps.clearAllTransactions();
            const response = await storeRequestSender.getPlaylistById(playlistId);
            const data = await response.json();
            if (data.success) {
                storeReducer({
                    type: GlobalStoreActionType.EDIT_PLAYLIST,
                    payload: {playlist: data.playlist}
                });
            } else
                throw new Error("Failed to edit playlist!");
        } catch (err) {
            console.log(err.message);
        }
    }
    
    store.hideModals = () => {
        auth.errorMessage = null;
        tps.clearAllTransactions();
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });
    }

    store.updateCurrentListName = async (newPlaylistName) => {
        try {
            if (!store.currentList || !store.currentList.id)
                throw new Error("No current list being edited!");

            while (pendingOperations.size > 0) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }

            let playlist = { ...store.currentList, name: newPlaylistName };
            const response = await storeRequestSender.updatePlaylistNameById(store.currentList.id, playlist);
            const data = await response.json();
            if (data.success) {
                storeReducer({
                    type: GlobalStoreActionType.UPDATE_CURRENT_LIST,
                    payload: { playlist: null }
                });
                await store.loadPlaylists();
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    store.copyPlaylist = async (playlistId) => {
        try {
            const response = await storeRequestSender.copyPlaylist(playlistId);
            const data = await response.json();
            if (data.success) {
                await store.loadPlaylists();
            } else {
                throw new Error(data.errorMessage || "Failed to copy playlist");
            }
        } catch (err) {
            console.log(err.message);
            throw err;
        }
    }

    store.markPlaylistForDeletion = (playlist) => {
        storeReducer({
            type: GlobalStoreActionType.MARK_PLAYLIST_FOR_DELETION,
            payload: { playlist }
        });
    }

    store.deletePlaylist = async (playlistId) => {
        try {
            const response = await storeRequestSender.deletePlaylist(playlistId);
            const data = await response.json();
            if (data.success) {
                storeReducer({
                    type: GlobalStoreActionType.HIDE_MODALS,
                    payload: {}
                });
                await store.loadPlaylists();
            } else {
                throw new Error(data.errorMessage || "Failed to delete playlist");
            }
        } catch (err) {
            console.log(err.message);
            throw err;
        }
    }

    store.addCreateSongTransaction = async (playlistId, title, artist, year, youTubeId, ownerId) => {
        let song = {
            title: title,
            artist: artist,
            year: year,
            youTubeId: youTubeId,
            ownerId: ownerId
        }
        const songs = await store.getSongsInPlaylist(playlistId);
        let transaction = new CreateSong_Transaction(store, songs.length, song, playlistId);
        tps.processTransaction(transaction);
    }

    store.createSong = async (index, song, playlistId) => {
        const operationId = `create-${playlistId}-${index}-${Date.now()}`;
        pendingOperations.add(operationId);
        try {
            const order = index;
            const newSong = {
                title: song.title,
                artist: song.artist,
                year: song.year,
                youTubeId: song.youTubeId,
                ownerId: song.ownerId
            }
            const songResponse = await storeRequestSender.createSong(newSong);
            const songData = await songResponse.json();

            if (!songData.success) {
                throw new Error(songData.errorMessage || "Failed to create song");
            }

            if (songData.success && songData.song) {
                const response = await storeRequestSender.createPlaylistSong({
                    playlistId: playlistId,
                    songId: songData.song.id,
                    order: order
                });
                const data = await response.json();
                if (data.success) {
                    const updatedPlaylist = await storeRequestSender.getPlaylistById(playlistId);
                    const playlistData = await updatedPlaylist.json();
                    if (playlistData.success) {
                        storeReducer({
                            type: GlobalStoreActionType.CREATE_SONG,
                            payload: {
                                newCurrentList: playlistData.playlist
                            }
                        })
                    }
                } else {
                    throw new Error(data.errorMessage || "Failed to add song to playlist");
                }
            }
        } catch (err) {
            console.log("Error creating song:", err.message);
            alert(err.message || "Failed to create song. Please try again.");
        } finally {
            pendingOperations.delete(operationId);
        }
    }

    store.duplicateSong = async (playlistId, song) => {
        let counter = 0;
        let newTitle = song.title + " (Copy)";
        
        let existingSong = null;
        do {
            const response = await storeRequestSender.getSongs();
            const data = await response.json();
            if (data.success && data.songs && data.songs.length > 0) {
                existingSong = data.songs.find(s => 
                    s.title === newTitle && 
                    s.artist === song.artist && 
                    s.year === song.year
                );
                if (existingSong) {
                    counter++;
                    newTitle = song.title + " (Copy " + counter + ")";
                } else {
                    existingSong = null;
                }
            } else {
                existingSong = null;
            }
        } while (existingSong !== null);
        
        await store.addCreateSongTransaction(playlistId, newTitle, song.artist, song.year, song.youTubeId, auth.user.userId);
    }

    store.addRemoveSongTransaction = (playlistId, index, song) => {
        let transaction = new RemoveSong_Transaction(store, index, song, playlistId);
        tps.processTransaction(transaction);
    }

    store.addMoveSongTransaction = (playlistId, oldIndex, newIndex) => {
        let transaction = new MoveSong_Transaction(store, oldIndex, newIndex, playlistId);
        tps.processTransaction(transaction);
    }

    store.removeSong = async (index, song, playlistId) => {
        const operationId = `remove-${playlistId}-${index}-${Date.now()}`;
        pendingOperations.add(operationId);
        try {
            let songId = null;
            if (playlistId) {
                const songIds = await store.getSongsInPlaylist(playlistId);
                if (songIds && songIds[index] !== undefined && songIds[index] !== null) {
                    songId = songIds[index];
                }
            }
            
            if (!songId && song?.id) {
                songId = song.id;
            }
            
            if (!songId) {
                throw new Error("Cannot remove song: song ID not found at index " + index);
            }
            
            const fullSong = await store.getSongById(songId);
            const isDuplicate = fullSong && fullSong.title && fullSong.title.includes("(Copy)");
            
            let response;
            if (isDuplicate) {
                response = await storeRequestSender.deleteSongById(songId, playlistId);
            } else {
                response = await storeRequestSender.deletePlaylistSong(playlistId, songId);
            }
            
            const data = await response.json();
            if (data.success) {
                const updatedPlaylist = await storeRequestSender.getPlaylistById(playlistId);
                const playlistData = await updatedPlaylist.json();
                if (playlistData.success) {
                    storeReducer({
                        type: GlobalStoreActionType.DELETE_SONG,
                        payload: {
                            newCurrentList: playlistData.playlist
                        }
                    })
                }
            } else {
                const updatedPlaylist = await storeRequestSender.getPlaylistById(playlistId);
                const playlistData = await updatedPlaylist.json();
                if (playlistData.success) {
                    storeReducer({
                        type: GlobalStoreActionType.DELETE_SONG,
                        payload: {
                            newCurrentList: playlistData.playlist
                        }
                    })
                }
            }
        } catch (err) {
            console.log("Error removing song:", err.message);
            try {
                const updatedPlaylist = await storeRequestSender.getPlaylistById(playlistId);
                const playlistData = await updatedPlaylist.json();
                if (playlistData.success) {
                    storeReducer({
                        type: GlobalStoreActionType.DELETE_SONG,
                        payload: {
                            newCurrentList: playlistData.playlist
                        }
                    })
                }
            } catch (refreshErr) {
                console.log("Error refreshing playlist:", refreshErr.message);
            }
        } finally {
            pendingOperations.delete(operationId);
        }
    }

    store.undo = function () {
        tps.undoTransaction();
    }

    store.redo = function () {
        tps.doTransaction();
    }

    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }

    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToDo());
    }

    store.moveSong = async (startIndex, endIndex, playlistId) => {
        const operationId = `move-${playlistId}-${startIndex}-${endIndex}-${Date.now()}`;
        pendingOperations.add(operationId);
        try {
            const songIds = await store.getSongsInPlaylist(playlistId);
            
            if (!songIds || songIds.length === 0) {
                throw new Error("No songs in playlist");
            }

            if (startIndex < 0 || startIndex >= songIds.length || endIndex < 0 || endIndex >= songIds.length) {
                throw new Error("Invalid song indices");
            }

            const newSongIds = [...songIds];
            
            if (startIndex < endIndex) {
                const temp = newSongIds[startIndex];
                for (let i = startIndex; i < endIndex; i++) {
                    newSongIds[i] = newSongIds[i + 1];
                }
                newSongIds[endIndex] = temp;
            } else if (startIndex > endIndex) {
                const temp = newSongIds[startIndex];
                for (let i = startIndex; i > endIndex; i--) {
                    newSongIds[i] = newSongIds[i - 1];
                }
                newSongIds[endIndex] = temp;
            }

            const songOrders = newSongIds.map((songId, index) => ({
                songId: songId,
                order: index
            })).filter(item => item.songId !== null && item.songId !== undefined);

            const response = await storeRequestSender.updatePlaylistSongOrders(playlistId, songOrders);
            const data = await response.json();
            
            if (data.success) {
                const updatedPlaylist = await storeRequestSender.getPlaylistById(playlistId);
                const playlistData = await updatedPlaylist.json();
                if (playlistData.success) {
                    storeReducer({
                        type: GlobalStoreActionType.UPDATE_CURRENT_LIST,
                        payload: {
                            playlist: playlistData.playlist
                        }
                    });
                }
            } else {
                throw new Error(data.errorMessage || "Failed to move song");
            }
        } catch (err) {
            console.log("Error moving song:", err.message);
        } finally {
            pendingOperations.delete(operationId);
        }
    }

    store.loadSongs = async (searchCriteria = null, sortCriteria = null) => {
        try {
            const params = new URLSearchParams();
            if (searchCriteria) {
                if (searchCriteria.title) params.append('title', searchCriteria.title);
                if (searchCriteria.artist) params.append('artist', searchCriteria.artist);
                if (searchCriteria.year) params.append('year', searchCriteria.year);
            }
            if (sortCriteria) {
                if (sortCriteria.type) params.append('sortBy', sortCriteria.type);
                if (sortCriteria.order) params.append('sortOrder', sortCriteria.order === 'desc' ? 'desc' : 'asc');
            }

            const response = await storeRequestSender.getSongs(params.toString());
            const data = await response.json();
            if (data.success) {
                storeReducer({
                    type: GlobalStoreActionType.LOAD_SONGS,
                    payload: { songs: data.songs }
                });
            } else
                throw new Error("FAILED TO GET SONGS");
        } catch (err) {
            console.log(err.message);
        }
    }

    store.showEditSongModal = async (songId, index) => {
        try {
            if (songId === null || songId === undefined) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_SONG,
                    payload: { song: null, index: -1 }
                });
            } else {
                const song = await store.getSongById(songId);
                if (song) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_SONG,
                        payload: { song, index }
                    });
                }
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    store.updateSong = async (songId, updatedSong) => {
        try {
            const response = await storeRequestSender.updateSong(songId, updatedSong);
            const data = await response.json();
            if (data.success) {
                storeReducer({
                    type: GlobalStoreActionType.HIDE_MODALS,
                    payload: {}
                });
                await new Promise(resolve => setTimeout(resolve, 100));
                await store.loadSongs();
            } else {
                throw new Error(data.errorMessage || "Failed to update song");
            }
        } catch (err) {
            console.log(err.message);
            throw err;
        }
    }

    store.markSongForDeletion = (song) => {
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_DELETION,
            payload: { song }
        });
    }

    store.deleteSong = async (songId) => {
        try {
            const response = await storeRequestSender.deleteSongById(songId, null);
            const data = await response.json();
            if (data.success) {
                storeReducer({
                    type: GlobalStoreActionType.HIDE_MODALS,
                    payload: {}
                });
                await new Promise(resolve => setTimeout(resolve, 100));
                await store.loadSongs();
            } else {
                throw new Error(data.errorMessage || "Failed to delete song");
            }
        } catch (err) {
            console.log(err.message);
            throw err;
        }
    }

    store.addSongToPlaylist = async (songId, playlistId) => {
        try {
            const songs = await store.getSongsInPlaylist(playlistId);
            const order = songs.length;
            const response = await storeRequestSender.createPlaylistSong({
                playlistId: playlistId,
                songId: songId,
                order: order
            });
            const data = await response.json();
            if (data.success) {
                if (store.currentList && store.currentList.id === playlistId) {
                    const updatedPlaylist = await storeRequestSender.getPlaylistById(playlistId);
                    const playlistData = await updatedPlaylist.json();
                    if (playlistData.success) {
                        storeReducer({
                            type: GlobalStoreActionType.UPDATE_CURRENT_LIST,
                            payload: { playlist: playlistData.playlist }
                        });
                    }
                }
            }
        } catch (err) {
            console.log(err.message);
            throw err;
        }
    }

    useEffect(() => {
        if (auth.user && store.playlists.length === 0) {
            store.loadPlaylists();
        }
    }, [auth.user]);

    return (
        <GlobalStoreContext.Provider value={{store}}>
            {props.children}
        </GlobalStoreContext.Provider>
    )
}
export default GlobalStoreContext;
export { GlobalStoreContextProvider }

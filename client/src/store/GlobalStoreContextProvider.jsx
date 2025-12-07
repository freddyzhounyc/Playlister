import { useState, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth/AuthContextProvider';
import storeRequestSender from './requests/index';

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    UPDATE_USER: "UPDATE_USER",
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    INCREMENT_NEW_LIST_COUNTER: "INCREMENT_NEW_LIST_COUNTER"
}

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    ERROR : "ERROR"
}

function GlobalStoreContextProvider(props) {
    const { auth } = useContext(AuthContext);
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentPlayingList: null,
        currentList: null, // List currently being edited
        currentSongIndex : -1,
        currentSong : null, // Song currently being edited
        newListCounter: 0,
        listNameActive: false, // * Possibly don't need **
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null
    });
    const navigate = useNavigate();

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.UPDATE_USER: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentPlayingList: store.currentPlayingList,
                    currentList: store.currentList,
                    currentSongIndex : store.currentSongIndex,
                    currentSong : store.currentSong,
                    newListCounter: store.newListCounter, // ** Possibly don't need **
                    listNameActive: store.listNameActive, // * Possibly don't need **
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion
                });
            }
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                })
            }
            case GlobalStoreActionType.INCREMENT_NEW_LIST_COUNTER: {
                return setStore({
                    ...store,
                    newListCounter: store.newListCounter + 1
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
            setStore({
                type: GlobalStoreActionType.UPDATE_USER,
                payload: null
            });
            auth.updateUser(null, err.message);
        }
    }
    store.createNewList = async () => {
        let counter = 0;
        let newListName = "Untitled" + counter;
        let playlistsWithSelectedNewName = [];
        do {
            const response = await storeRequestSender.getAllPlaylistsByName(newListName);
            const data = await response.json();
            playlistsWithSelectedNewName = data.playlists;
            if (playlistsWithSelectedNewName.length > 0)
                counter++;
            newListName = "Untitled" + counter;
        } while (playlistsWithSelectedNewName.length > 0);
        const response = await storeRequestSender.createPlaylist(newListName, auth.user.userId);
        const data = await response.json();

        if (data.status === 201) {
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: data.playlist
            });
        }
    }
    store.loadIdNamePairs = async () => {
        try {
            const response = await storeRequestSender.getPlaylistPairs();
            const data = await response.json();
            if (data.success) {
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: data.idNamePairs
                });
            } else
                throw new Error("FAILED TO GET THE LIST PAIRS");
        } catch (err) {
            console.log(err.message);
        }
    }
    store.getUserByPlaylistId = async (playlistId) => {
        try {
            const response = await storeRequestSender.getUserByPlaylistId(playlistId);
            const data = await response.json();
            if (data.success)
                return data.user; // No call to reducer because this is just a helper method (no state change)
            else
                throw new Error("Failed to get User by Playlist ID");
        } catch (err) {
            console.log(err.message);
        }
    }
    // TO-DO
    // store.duplicatePlaylist = async (playlistId) => {
    //     try {
    //         const response = await storeRequestSender.getPlaylistById(playlistId);
    //         const data = await response.json();
    //         if (data.success) {
    //             const list = data.playlist;
    //             let duplicateList = {
    //                 name: list.name,
    //                 ownerId: list.ownerId
    //             }
    //         }
    //     }
    // }
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
        }
    }
    store.getSongById = async (songId) => {
        try {
            const response = await storeRequestSender.getSongById(songId);
            const data = await response.json();
            if (data.success)
                return data.song; // No call to reducer because this is just a helper method (no state change)
            else
                throw new Error("Failed to get User by Playlist ID");
        } catch (err) {
            console.log(err.message);
        }
    }

    return (
        <GlobalStoreContext.Provider value={{store}}>
            {props.children}
        </GlobalStoreContext.Provider>
    )
}
export default GlobalStoreContext;
export { GlobalStoreContextProvider }
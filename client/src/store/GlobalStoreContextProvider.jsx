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
    HIDE_MODALS: "HIDE_MODALS"
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
        newListCounter: 0, // ** Possibly don't need **
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

    return (
        <GlobalStoreContext.Provider value={{store}}>
            {props.children}
        </GlobalStoreContext.Provider>
    )
}
export default GlobalStoreContext;
export { GlobalStoreContextProvider }
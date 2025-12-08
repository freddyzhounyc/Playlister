import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { useState, useContext, useEffect } from 'react';
import GlobalStoreContext from '../store/GlobalStoreContextProvider';
import ClearableTextField from './ClearableTextField';
import EditPlaylistModalSongCard from './EPM-SongCard';

const EditPlaylistModal = () => {
    const { store } = useContext(GlobalStoreContext);

    const [playlistNameInput, setPlaylistNameInput] = useState(store.currentList.name);
    const [songList, setSongList] = useState([{
        title: "Untitled",
        artist: "?",
        year: 2000,
        youTubeId: "rgV4KRVUnN4"
    }]);

    useEffect(() => {
        const getSongsList = async () => {
            const songIdsList = await store.getSongsInPlaylist(store.currentList.id);
            const songList = await handleSongIdsListToSongsList(songIdsList);
            setSongList(songList);
        }
        getSongsList();
    }, []);
    const handleGetSongById = async (songId) => {
        const song = await store.getSongById(songId);
        return song;
    }
    const handleSongIdsListToSongsList = async (songsIdsList) => {
        const result = [];
        for (let i = 0; i < songsIdsList.length; i++) {
            const song = await handleGetSongById(songsIdsList[i]);
            result.push({
                id: song.id,
                title: song.title,
                artist: song.artist,
                year: song.year,
                youTubeId: song.youTubeId
            });
        }
        return result;
    }

    return (
        <Modal open={store.currentModal === "EDIT_PLAYLIST_MODAL"} keepMounted sx={{ marginLeft: "22.5%", marginTop: "4%", width: "55%", height: "80vh", border: "1px solid black" }}>
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
                <Box sx={{ backgroundColor: "#0E8503", width: "100%", height: "6%", border: "1px solid black" }}>
                    <Typography variant="h6" component="h1" sx={{ marginTop: "5px", marginLeft: "10px", color: "white" }}>
                        Edit Playlist
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", backgroundColor: "#B0FFB5", width: "100%", height: "94%", border: "1px solid black" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", width: "97%", height: "100%", marginLeft: "1.5%" }}>
                        <Box sx={{ display: "flex", width: "100%", height: "10%", marginTop: "10px" }}>
                            <Box sx={{ marginTop: "1px" }}>
                                <ClearableTextField value={playlistNameInput} label="Playlist Name" setInputValue={setPlaylistNameInput} setWidth={750}/>
                            </Box>
                            <Box sx={{ flexGrow: 1 }} />
                            <Button variant="contained" onClick={null} size="small"
                            sx={{ fontSize: "25px", width: "100px", height: "50px", marginTop: "3px", marginRight: "0px", backgroundColor: "#2C2C2C", textTransform: "none", borderRadius: "7px", border: "1px solid black" }}>
                                <AddIcon />
                                <MusicNoteIcon />
                            </Button>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", width: "100%", height: "75%", marginTop: "10px", backgroundColor: "white", borderRadius: "10px", overflow: "auto" }}>
                            {songList.map((song, index) => {
                                return <EditPlaylistModalSongCard key={index} song={song} num={index+1} />
                            })}
                        </Box>
                        <Box sx={{ display: "flex", marginTop: "15px", width: "100%" }}>
                            <Box>
                                <Button variant="contained" onClick={null} size="small"
                                sx={{ fontSize: "18px", width: "100px", height: "50px", marginTop: "3px", backgroundColor: "#2C2C2C", textTransform: "none", borderRadius: "7px", border: "1px solid black" }}>
                                    <UndoIcon />
                                    <Typography variant="body1" component="h6" sx={{ marginLeft: "5px", fontSize: "20px", fontWeight: "bold" }}>
                                        Undo
                                    </Typography>
                                </Button>
                                <Button variant="contained" onClick={null} size="small"
                                sx={{ fontSize: "18px", width: "100px", height: "50px", marginTop: "3px", marginLeft: "10px", backgroundColor: "#2C2C2C", textTransform: "none", borderRadius: "7px", border: "1px solid black" }}>
                                    <RedoIcon />
                                    <Typography variant="body1" component="h6" sx={{ marginLeft: "5px", fontSize: "20px", fontWeight: "bold" }}>
                                        Redo
                                    </Typography>
                                </Button>
                            </Box>
                            <Box sx={{ flexGrow: 1 }} />
                            <Box>
                                <Button variant="contained" onClick={null} size="small"
                                sx={{ fontSize: "18px", width: "100px", height: "50px", marginTop: "3px", marginRight: "0px", backgroundColor: "#2C2C2C", textTransform: "none", borderRadius: "7px", border: "1px solid black" }}>
                                    Close
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    )
}
export default EditPlaylistModal;
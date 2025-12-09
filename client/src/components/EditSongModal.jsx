import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalStoreContext from '../store/GlobalStoreContextProvider';
import AuthContext from '../auth/AuthContextProvider';
import ClearableTextField from './ClearableTextField';
import storeRequestSender from '../store/requests/index';

const EditSongModal = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [year, setYear] = useState("");
    const [youTubeId, setYouTubeId] = useState("");
    const [countCompleteClick, setCountCompleteClick] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (store.currentModal === "EDIT_SONG" && store.currentSong) {
            setTitle(store.currentSong.title || "");
            setArtist(store.currentSong.artist || "");
            setYear(store.currentSong.year || "");
            setYouTubeId(store.currentSong.youTubeId || "");
        }
    }, [store.currentSong]);

    useEffect(() => {
        if (store.currentModal === "EDIT_SONG" && !store.currentSong) {
            setTitle("");
            setArtist("");
            setYear("");
            setYouTubeId("");
        }
    }, [store.currentModal, store.currentSong]);

    useEffect(() => {
        if (store.currentModal !== "EDIT_SONG") {
            setTitle("");
            setArtist("");
            setYear("");
            setYouTubeId("");
        }
    }, [store.currentModal]);

    const isFormValid = () => {
        return title.trim() !== "" && 
               artist.trim() !== "" && 
               year && !isNaN(parseInt(year)) && parseInt(year) > 0 &&
               youTubeId.trim() !== "";
    }

    const handleComplete = async () => {
        if (!isFormValid()) return;

        try {
            if (store.currentSong) {
                const songData = {
                    title: title.trim(),
                    artist: artist.trim(),
                    year: parseInt(year),
                    youTubeId: youTubeId.trim()
                };
                await store.updateSong(store.currentSong.id, songData);
                setTimeout(async () => {
                    await store.loadSongs();
                    store.hideModals();
                }, 100);
            } else {
                const response = await storeRequestSender.createSong({
                    title: title.trim(),
                    artist: artist.trim(),
                    year: parseInt(year),
                    youTubeId: youTubeId.trim(),
                    ownerId: auth.user.userId
                });
                const data = await response.json();
                if (data.success) {
                    setTitle("");
                    setArtist("");
                    setYear("");
                    setYouTubeId("");
                    store.hideModals();
                    setTimeout(async () => {
                        await store.loadSongs();
                    }, 50);
                } else {
                    throw new Error(data.errorMessage || "Failed to create song");
                }
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    const handleCancel = () => {
        store.hideModals();
    }

    return (
        <Modal open={store.currentModal === "EDIT_SONG"} keepMounted>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: "30%",
                height: "50%",
                bgcolor: '#B0FFB5',
                border: '2px solid #000',
                boxShadow: 24,
            }}>
                <Box sx={{ backgroundColor: "#0E8503", width: "96.5%", padding: "10px", marginBottom: "20px" }}>
                    <Typography variant="h6" component="h1" sx={{ color: "white" }}>
                        {store.currentSong ? "Edit Song" : "New Song"}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "30px", gap: "20px" }}>
                    <ClearableTextField 
                        value={title} 
                        label="Title" 
                        setInputValue={setTitle} 
                        setWidth={450}
                    />
                    <ClearableTextField 
                        value={artist} 
                        label="Artist" 
                        setInputValue={setArtist} 
                        setWidth={450}
                    />
                    <ClearableTextField 
                        value={year} 
                        label="Year" 
                        type="number"
                        setInputValue={setYear} 
                        setWidth={450}
                    />
                    <ClearableTextField 
                        value={youTubeId} 
                        label="YouTube Id" 
                        setInputValue={setYouTubeId} 
                        setWidth={450}
                    />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: "30px", gap: "150px" }}>
                    <Button 
                        variant="contained" 
                        onClick={handleComplete}
                        disabled={!isFormValid()}
                        sx={{ backgroundColor: isFormValid() ? "#2C2C2C" : "#999", textTransform: "none" }}
                    >
                        Complete
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={handleCancel}
                        sx={{ backgroundColor: "#2C2C2C", textTransform: "none" }}
                    >
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}
export default EditSongModal;

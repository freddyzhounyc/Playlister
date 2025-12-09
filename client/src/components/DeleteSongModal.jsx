import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useContext } from 'react';
import GlobalStoreContext from '../store/GlobalStoreContextProvider';

const DeleteSongModal = () => {
    const { store } = useContext(GlobalStoreContext);

    const handleConfirm = async () => {
        try {
            await store.deleteSong(store.songMarkedForDeletion.id);
        } catch (err) {
            console.log(err.message);
        }
    }

    const handleCancel = () => {
        store.hideModals();
    }

    if (!store.songMarkedForDeletion) {
        return null;
    }

    return (
        <Modal open={store.currentModal === "DELETE_SONG"} keepMounted>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: "30%",
                height: "30%",
                bgcolor: '#B0FFB5',
                border: '2px solid #000',
                boxShadow: 24,
            }}>
                <Box sx={{ backgroundColor: "#0E8503", width: "96.5%", padding: "10px", marginBottom: "20px" }}>
                    <Typography variant="h6" component="h1" sx={{ color: "white" }}>
                        Remove Song?
                    </Typography>
                </Box>
                <Box sx={{ m: "10px" }}>
                    <Typography variant="h5" sx={{ marginBottom: "10px", textAlign: "center" }}>
                        Are you sure you want to remove the song from the catalog?
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: "20px", textAlign: "center", color: "gray" }}>
                        Doing so will remove it from all of your playlists.
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: "30px", gap: "150px" }}>
                    <Button 
                        variant="contained" 
                        onClick={handleConfirm}
                        sx={{ backgroundColor: "#2C2C2C", textTransform: "none" }}
                    >
                        Remove Song
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
export default DeleteSongModal;

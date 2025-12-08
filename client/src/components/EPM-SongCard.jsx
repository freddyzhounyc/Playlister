import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import { useContext } from 'react';
import GlobalStoreContext from '../store/GlobalStoreContextProvider';

const EditPlaylistModalSongCard = ({ song, num, handleDuplicateSong }) => {
    const { store } = useContext(GlobalStoreContext);

    return (
        <Box sx={{ flexShrink: 0, display: "flex", width: "97%", height: "10%", backgroundColor: "#FFF7B2", marginLeft: "10px", marginTop: "10px", borderRadius: "7px", border: "1px solid black" }}>
            <Box sx={{ display: "flex", marginTop: "10px", marginLeft: "10px" }}>
                <Typography variant="body1" component="h6" sx={{ fontSize: "21px", color: "#1E1E1E" }}>
                    {num + "."}
                </Typography>
                <Typography variant="body1" component="h6" sx={{ fontSize: "19px", marginLeft: "5px", marginTop: "2px", fontWeight: "550", color: "#1E1E1E" }}>
                    {song.title + " by " + song.artist + " (" + song.year + ")"}
                </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
                <IconButton onClick={() => handleDuplicateSong(song)}
                sx={{ fontSize: "25px", width: "fit-content", height: "100%", backgroundColor: "#FFF7B2", color: "black", textTransform: "none", borderRadius: "10px" }}>
                    <ContentCopyIcon />
                </IconButton>
                <IconButton onClick={null}
                sx={{ fontSize: "25px", width: "fit-content", height: "100%", backgroundColor: "#FFF7B2", color: "black", textTransform: "none", borderRadius: "10px" }}>
                    <CloseIcon />
                </IconButton>
            </Box>
        </Box>
    );
}
export default EditPlaylistModalSongCard;
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect, useContext } from 'react';
import GlobalStoreContext from '../store/GlobalStoreContextProvider';

const PlaylistCard = ({ pair }) => {
    const { store } = useContext(GlobalStoreContext);
    const [user, setUser] = useState({
        profileImage: "img",
        userName: "user",
        email: "email",
        userId: -1
    });
    const [songList, setSongList] = useState([]);

    useEffect(() => {
        const getUser = async () => {
            const user = await handleGetUserByPlaylistId(pair.id);
            setUser(user);
            const songIdsList = await store.getSongsInPlaylist(pair.id);
            const songList = await handleSongIdsListToSongsList(songIdsList);
            setSongList(songList);
        }
        getUser();
    }, []);

    const handleButtonPress = (event) => {
        event.stopPropagation();
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
    const handleGetSongById = async (songId) => {
        const song = await store.getSongById(songId);
        return song;
    }
    const handleGetUserByPlaylistId = async (playlistId) => {
        const user = await store.getUserByPlaylistId(playlistId);
        return user;
    }

    const handlePlayPlaylist = (event) => {
        event.stopPropagation();
        store.showPlayPlaylistModal(pair.id);
    }
    const handleEditPlaylist = (event) => {
        event.stopPropagation();
        store.showEditPlaylistModal(pair.id);
    }

    return (
        <Accordion sx={{ marginBottom: "20px", width: "100%" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Paper elevation={0} sx={{ height: "100%", width: "100%", backgroundColor: 'transparent', display: "flex", flexDirection: "row" }}>
                    <Box sx={{ display: "flex" }}>
                        <Avatar src={user.profileImage} sx={{ width: 50, height: 50, marginLeft: "-7px", backgroundColor: "grey" }} />
                        <Box sx={{ display: "flex", flexDirection: "column", marginTop: "2px", marginLeft: "10px", width: "90%" }}>
                            <Typography variant="h6" component="h6" sx={{ fontSize: "18px", width: "140px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {pair.name}
                            </Typography>
                            <Typography variant="body2" component="h6" sx={{ fontSize: "13px", marginTop: "-5px" }}>
                                {user.userName}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: "flex", flexDirection: "row-reverse", gap: "3px" }}>
                        <Button variant="contained" onClick={handlePlayPlaylist} size="small"
                        sx={{ fontSize: "13px", width: "fit-content", height: "30px", marginTop: "10px", marginRight: "0px", backgroundColor: "#DE24BC", textTransform: "none", borderRadius: "7px", border: "1px solid black" }}>
                            Play
                        </Button>
                        <Button variant="contained" onClick={handleButtonPress} size="small"
                        sx={{ fontSize: "13px", width: "fit-content", height: "30px", marginTop: "10px", backgroundColor: "#077836", textTransform: "none", borderRadius: "7px", border: "1px solid black" }}>
                            Copy
                        </Button>
                        <Button variant="contained" onClick={handleEditPlaylist} size="small"
                        sx={{ fontSize: "13px", width: "fit-content", height: "30px", marginTop: "10px", backgroundColor: "#3A64C4", textTransform: "none", borderRadius: "7px", border: "1px solid black" }}>
                            Edit
                        </Button>
                        <Button variant="contained" onClick={handleButtonPress} size="small"
                        sx={{ fontSize: "13px", width: "fit-content", height: "30px", marginTop: "10px", backgroundColor: "#D2292F", textTransform: "none", borderRadius: "7px", border: "1px solid black" }}>
                            Delete
                        </Button>
                    </Box>
                </Paper>
            </AccordionSummary>
            <AccordionDetails>
                {songList.map((song, index) => {
                    return (
                        <Typography key={index}>
                            {index + 1 + ". " + song.title + " by " + song.artist + " (" + song.year + ")"}
                        </Typography>
                    )
                })}
            </AccordionDetails>
        </Accordion>
    )
}
export default PlaylistCard;
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useState, useContext, useEffect } from 'react';
import GlobalStoreContext from '../store/GlobalStoreContextProvider';
import PlayPlaylistModalSongCard from './PPM-SongCard';
import YouTubePlayer from './YouTubePlayer'

const PlayPlaylistModal = () => {
    const { store } = useContext(GlobalStoreContext);

    const [user, setUser] = useState({
        profileImage: "img",
        userName: "user",
        email: "email",
        userId: -1
    });
    const [songList, setSongList] = useState([{
        title: "Untitled",
        artist: "?",
        year: 2000,
        youTubeId: "rgV4KRVUnN4"
    }]);
    const [currentSongPlayingIndex, setCurrentSongPlayingIndex] = useState(0);

    useEffect(() => {
        const getUser = async () => {
            const user = await handleGetUserByPlaylistId(store.currentPlayingList.id);
            setUser(user);
            const songIdsList = await store.getSongsInPlaylist(store.currentPlayingList.id);
            const songList = await handleSongIdsListToSongsList(songIdsList);
            setSongList(songList);
        }
        getUser();
    }, []);
    const handleGetUserByPlaylistId = async (playlistId) => {
        const user = await store.getUserByPlaylistId(playlistId);
        return user;
    }
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

    const handleSongSkipNext = (event) => {
        const playlistLength = songList.length;
        if (currentSongPlayingIndex === playlistLength-1)
            setCurrentSongPlayingIndex(0);
        else
            setCurrentSongPlayingIndex(currentSongPlayingIndex + 1);
    }
    const handleSongSkipPrevious = (event) => {
        const playlistLength = songList.length;
        if (currentSongPlayingIndex === 0)
            setCurrentSongPlayingIndex(playlistLength - 1);
        else
            setCurrentSongPlayingIndex(currentSongPlayingIndex - 1);
    }

    const handleCloseModal = (event) => {
        store.hideModals();
    }

    return (
        <Modal open={store.currentModal === "PLAY_PLAYLIST_MODAL"} keepMounted sx={{ marginLeft: "22.5%", marginTop: "4%", width: "55%", height: "80vh", border: "1px solid black" }}>
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
                <Box sx={{ backgroundColor: "#0E8503", width: "100%", height: "6%", border: "1px solid black" }}>
                    <Typography variant="h6" component="h1" sx={{ marginTop: "5px", marginLeft: "10px", color: "white" }}>
                        Play Playlist
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", backgroundColor: "#B0FFB5", width: "100%", height: "94%", border: "1px solid black" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: "white", height: "97%", width: "50%", marginTop: "10px", marginLeft: "10px", borderRadius: "10px" }}>
                        <Box sx={{ display: "flex", height: "10%" }}>
                            <Avatar src={user.profileImage} sx={{ width: 50, height: 50, marginLeft: "7px", marginTop: "7px", backgroundColor: "grey" }} />
                            <Box sx={{ display: "flex", flexDirection: "column", marginTop: "10px", marginLeft: "10px", width: "90%" }}>
                                <Typography variant="h6" component="h6" sx={{ fontSize: "15px", width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {store.currentPlayingList.name}
                                </Typography>
                                <Typography variant="body2" component="h6" sx={{ fontSize: "13px", marginTop: "-5px" }}>
                                    {user.userName}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: "90%", width: "100%", overflow: "auto" }}>
                            {songList.map((song, index) => {
                                return <PlayPlaylistModalSongCard key={index} song={song} num={index+1} selected={index === currentSongPlayingIndex} />
                            })}
                        </Box>
                    </Box>
                    <Box>
                        <Box sx={{ display: "flex", flexDirection: "column", height: "97%", width: "47%", marginTop: "10px", marginLeft: "10px" }}>
                            { songList.length !== 0 &&
                            <YouTubePlayer videoId={songList[currentSongPlayingIndex].youTubeId} handleSongSkipPrevious={handleSongSkipPrevious} handleSongSkipNext={handleSongSkipNext}/>
                            }
                        </Box>
                        <Box sx={{ flexGrow: 1 }} />
                        <Button variant="contained" onClick={handleCloseModal}
                        sx={{ width: "fit-content", height: "37px", marginTop: "-60px", marginLeft: "400px", backgroundColor: "#2C2C2C", textTransform: "none", borderRadius: "10px" }}>
                            Close
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    )
}
export default PlayPlaylistModal;
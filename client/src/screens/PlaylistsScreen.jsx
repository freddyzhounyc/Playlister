import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useState, useContext, useEffect } from 'react';
import GlobalStoreContext from '../store/GlobalStoreContextProvider';
import AuthContext from '../auth/AuthContextProvider';
import ClearableTextField from '../components/ClearableTextField';
import PlaylistCard from '../components/PlaylistCard';
import PlayPlaylistModal from '../components/PlayPlaylistModal';
import EditPlaylistModal from '../components/EditPlaylistModal';
import DeletePlaylistModal from '../components/DeletePlaylistModal';

const PlaylistsScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    const [searchByPlaylistName, setSearchByPlaylistName] = useState("");
    const [searchByUserName, setSearchByUserName] = useState("");
    const [searchBySongTitle, setSearchBySongTitle] = useState("");
    const [searchBySongArtist, setSearchBySongArtist] = useState("");
    const [searchBySongYear, setSearchBySongYear] = useState("");

    const [sortByIndex, setSortByIndex] = useState(0);
    const sortByChoices = [
        { label: "Listeners (Hi-Lo)", type: "listeners", order: "desc" },
        { label: "Listeners (Lo-Hi)", type: "listeners", order: "asc" },
        { label: "Playlist Name (A-Z)", type: "name", order: "asc" },
        { label: "Playlist Name (Z-A)", type: "name", order: "desc" },
        { label: "User Name (A-Z)", type: "userName", order: "asc" },
        { label: "User Name (Z-A)", type: "userName", order: "desc" }
    ];

    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    useEffect(() => {
        store.loadPlaylists();
    }, []);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    const handleMenuCloseBy = (index) => {
        setSortByIndex(index);
        const sortChoice = sortByChoices[index];
        store.sortPlaylists(sortChoice.type, sortChoice.order);
        handleMenuClose();
    }

    const handleCreateNewPlaylist = async () => {
        await store.createNewList();
    }

    const handleSearch = async () => {
        await store.searchPlaylists({
            playlistName: searchByPlaylistName,
            userName: searchByUserName,
            songTitle: searchBySongTitle,
            songArtist: searchBySongArtist,
            songYear: searchBySongYear
        });
    }

    const handleClear = async () => {
        setSearchByPlaylistName("");
        setSearchByUserName("");
        setSearchBySongTitle("");
        setSearchBySongArtist("");
        setSearchBySongYear("");
        await store.clearPlaylistSearch();
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }

    let playPlaylistModal = "";
    if (store.currentModal === "PLAY_PLAYLIST_MODAL")
        playPlaylistModal = <PlayPlaylistModal />
    let editPlaylistModal = "";
    if (store.currentModal === "EDIT_PLAYLIST_MODAL")
        editPlaylistModal = <EditPlaylistModal />
    let deletePlaylistModal = "";
    if (store.currentModal === "DELETE_PLAYLIST")
        deletePlaylistModal = <DeletePlaylistModal />

    return (
        <Box className="screen"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "77vh", border: "1px solid black" }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", height: "auto", width: "49%", gap: "30px" }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 900, color: "#C20CB9" }}>
                    Playlists
                </Typography>
                <ClearableTextField 
                    value={searchByPlaylistName} 
                    label={"by Playlist Name"} 
                    setInputValue={setSearchByPlaylistName} 
                    setWidth={450}
                    onKeyPress={handleKeyPress}
                />
                <ClearableTextField 
                    value={searchByUserName} 
                    label={"by User Name"} 
                    setInputValue={setSearchByUserName} 
                    setWidth={450}
                    onKeyPress={handleKeyPress}
                />
                <ClearableTextField 
                    value={searchBySongTitle} 
                    label={"by Song Title"} 
                    setInputValue={setSearchBySongTitle} 
                    setWidth={450}
                    onKeyPress={handleKeyPress}
                />
                <ClearableTextField 
                    value={searchBySongArtist} 
                    label={"by Song Artist"} 
                    setInputValue={setSearchBySongArtist} 
                    setWidth={450}
                    onKeyPress={handleKeyPress}
                />
                <ClearableTextField 
                    value={searchBySongYear} 
                    label={"by Song Year"} 
                    setInputValue={setSearchBySongYear} 
                    setWidth={450}
                    onKeyPress={handleKeyPress}
                />
                <Box sx={{ display: "flex", width: "80%" }}>
                    <Button variant="contained" onClick={handleSearch}
                    sx={{ width: "fit-content", height: "37px", marginTop: "40px", backgroundColor: "#2C2C2C", textTransform: "none", borderRadius: "100px" }}>
                        <SearchIcon />
                        Search
                    </Button>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button variant="contained" onClick={handleClear}
                    sx={{ width: "fit-content", height: "37px", marginTop: "40px", backgroundColor: "#2C2C2C", textTransform: "none", borderRadius: "100px" }}>
                        Clear
                    </Button>
                </Box>
            </Box>
            <Box sx={{ borderLeft: "1px solid grey", height: "70vh", position: "relative", right: "3%" }}/>
            <Box sx={{ display: "flex", flexDirection: "column", height: "85%", width: "45%" }}>
                <Box sx={{ display: "flex" }}>
                    <Box sx={{ display: "flex" }}>
                        <Typography variant="h5" component="h3" sx={{ fontWeight: 500 }}>
                            Sort:
                        </Typography>
                        <Link underline="none" onClick={handleProfileMenuOpen}>
                            <Typography variant="h5" component="h3" sx={{ marginLeft: "5px", fontWeight: 500, "&:hover": { cursor: "pointer" } }}>
                                {sortByChoices[sortByIndex].label}
                            </Typography>
                        </Link>
                    </Box>
                    <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right"
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                    >
                        {sortByChoices.map((choice, index) => (
                            <MenuItem 
                                key={index}
                                onClick={() => handleMenuCloseBy(index)} 
                                sx={{ "&:hover": { backgroundColor: "rgba(58, 151, 240, 0.3)" } }}
                            >
                                {choice.label}
                            </MenuItem>
                        ))}
                    </Menu>
                    <Box sx={{ flexGrow: 1 }}/>
                    <Box>
                        <Typography variant="h5" component="h3" sx={{ fontWeight: 500 }}>
                            {store.playlists.length} Playlist{store.playlists.length !== 1 ? 's' : ''}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", height: "70%", marginTop: "50px", overflow: "auto" }}>
                    {store.playlists.map(playlist => {
                        return <PlaylistCard key={playlist.id} playlist={playlist}/>
                    })}
                </Box>
                {auth.user && (
                    <Button variant="contained" onClick={handleCreateNewPlaylist}
                    sx={{ width: "fit-content", height: "37px", marginTop: "57px", backgroundColor: "#2C2C2C", textTransform: "none", borderRadius: "100px" }}>
                        <AddCircleOutlineIcon sx={{ marginRight: "5px" }}/>
                        New Playlist
                    </Button>
                )}
            </Box>
            { playPlaylistModal }
            { editPlaylistModal }
            { deletePlaylistModal }
        </Box>
    )
}
export default PlaylistsScreen;

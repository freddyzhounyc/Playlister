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
import ClearableTextField from '../components/ClearableTextField';
import PlaylistCard from '../components/PlaylistCard';

const PlaylistsScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    const [searchByPlaylistName, setSearchByPlaylistName] = useState("");
    const [searchByUserName, setSearchByUserName] = useState("");
    const [searchBySongTitle, setSearchBySongTitle] = useState("");
    const [searchBySongArtist, setSearchBySongArtist] = useState("");
    const [searchBySongYear, setSearchBySongYear] = useState("");

    const [sortByIndex, setSortByIndex] = useState(0);
    const sortByChoices = ["Listeners (Hi-Lo)", "Listeners (Lo-Hi)", "Playlist Name (Hi-Lo)", 
                       "Playlist Name (Lo-Hi)", "User Name (Hi-Lo)", "User Name (Lo-Hi)"];

    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleMenuClose = () => {
        setAnchorEl(null);
    }
    const handleMenuCloseBy = (index) => {
        setSortByIndex(index);
        handleMenuClose();
    }

    const handleCreateNewPlaylist = async () => {
        await store.createNewList();
        await store.loadIdNamePairs();
    }

    return (
        <Box className="screen"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "77vh", border: "1px solid black" }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", height: "auto", width: "49%", gap: "30px" }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 900, color: "#C20CB9" }}>
                    Playlists
                </Typography>
                <ClearableTextField value={searchByPlaylistName} label={"by Playlist Name"} setInputValue={setSearchByPlaylistName} setWidth={450}/>
                <ClearableTextField value={searchByUserName} label={"by User Name"} setInputValue={setSearchByUserName} setWidth={450}/>
                <ClearableTextField value={searchBySongTitle} label={"by Song Title"} setInputValue={setSearchBySongTitle} setWidth={450}/>
                <ClearableTextField value={searchBySongArtist} label={"by Song Artist"} setInputValue={setSearchBySongArtist} setWidth={450}/>
                <ClearableTextField value={searchBySongYear} label={"by Song Year"} setInputValue={setSearchBySongYear} setWidth={450}/>
                <Box sx={{ display: "flex", width: "80%" }}>
                    <Button variant="contained" onClick={null}
                    sx={{ width: "fit-content", height: "37px", marginTop: "40px", backgroundColor: "#2C2C2C", textTransform: "none", borderRadius: "100px" }}>
                        <SearchIcon />
                        Search
                    </Button>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button variant="contained" onClick={null}
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
                                {sortByChoices[sortByIndex]}
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
                        <MenuItem onClick={() => handleMenuCloseBy(0)} sx={{ "&:hover": { backgroundColor: "rgba(58, 151, 240, 0.3)" } }}>
                            Listeners (Hi-Lo)
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuCloseBy(1)} sx={{ "&:hover": { backgroundColor: "rgba(58, 151, 240, 0.3)" } }}>
                            Listeners (Lo-Hi)
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuCloseBy(2)} sx={{ "&:hover": { backgroundColor: "rgba(58, 151, 240, 0.3)" } }}>
                            Playlist Name (Hi-Lo)
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuCloseBy(3)} sx={{ "&:hover": { backgroundColor: "rgba(58, 151, 240, 0.3)" } }}>
                            Playlist Name (Lo-Hi)
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuCloseBy(4)} sx={{ "&:hover": { backgroundColor: "rgba(58, 151, 240, 0.3)" } }}>
                            User Name (Hi-Lo)
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuCloseBy(5)} sx={{ "&:hover": { backgroundColor: "rgba(58, 151, 240, 0.3)" } }}>
                            User Name (Lo-Hi)
                        </MenuItem>
                    </Menu>
                    <Box sx={{ flexGrow: 1 }}/>
                    <Box>
                        <Typography variant="h5" component="h3" sx={{ fontWeight: 500 }}>
                            Playlists
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", height: "70%", marginTop: "50px", overflow: "auto" }}>
                    {store.idNamePairs.map(pair => {
                        return <PlaylistCard key={pair.id} pair={pair}/>
                    })}
                </Box>
                <Button variant="contained" onClick={handleCreateNewPlaylist}
                sx={{ width: "fit-content", height: "37px", marginTop: "57px", backgroundColor: "#2C2C2C", textTransform: "none", borderRadius: "100px" }}>
                    <AddCircleOutlineIcon sx={{ marginRight: "5px" }}/>
                    New Playlist
                </Button>
            </Box>
        </Box>
    )
}
export default PlaylistsScreen;
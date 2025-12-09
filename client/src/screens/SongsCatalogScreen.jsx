import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState, useContext, useEffect, useRef } from 'react';
import GlobalStoreContext from '../store/GlobalStoreContextProvider';
import AuthContext from '../auth/AuthContextProvider';
import ClearableTextField from '../components/ClearableTextField';
import YouTubePlayer from '../components/YouTubePlayer';
import EditSongModal from '../components/EditSongModal';
import DeleteSongModal from '../components/DeleteSongModal';
import AddToPlaylistMenu from '../components/AddToPlaylistMenu';

const SongsCatalogScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    const [searchByTitle, setSearchByTitle] = useState("");
    const [searchByArtist, setSearchByArtist] = useState("");
    const [searchByYear, setSearchByYear] = useState("");

    const [sortByIndex, setSortByIndex] = useState(0);
    const sortByChoices = [
        { label: "Listens (Hi-Lo)", type: "listens", order: "desc" },
        { label: "Listens (Lo-Hi)", type: "listens", order: "asc" },
        { label: "Playlists (Hi-Lo)", type: "playlists", order: "desc" },
        { label: "Playlists (Lo-Hi)", type: "playlists", order: "asc" },
        { label: "Title (A-Z)", type: "title", order: "asc" },
        { label: "Title (Z-A)", type: "title", order: "desc" },
        { label: "Artist (A-Z)", type: "artist", order: "asc" },
        { label: "Artist (Z-A)", type: "artist", order: "desc" },
        { label: "Year (Hi-Lo)", type: "year", order: "desc" },
        { label: "Year (Lo-Hi)", type: "year", order: "asc" }
    ];

    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const [selectedSong, setSelectedSong] = useState(null);
    const [songMenuAnchor, setSongMenuAnchor] = useState(null);
    const [selectedSongForMenu, setSelectedSongForMenu] = useState(null);
    const [addToPlaylistAnchor, setAddToPlaylistAnchor] = useState(null);
    const addToPlaylistMenuItemRef = useRef(null);

    useEffect(() => {
        store.loadSongs();
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
        store.loadSongs(
            { title: searchByTitle, artist: searchByArtist, year: searchByYear },
            { type: sortChoice.type, order: sortChoice.order }
        );
        handleMenuClose();
    }

    const handleCreateNewSong = () => {
        store.showEditSongModal(null, -1);
    }

    const handleSearch = async () => {
        await store.loadSongs(
            { title: searchByTitle, artist: searchByArtist, year: searchByYear },
            { type: sortByChoices[sortByIndex].type, order: sortByChoices[sortByIndex].order }
        );
    }

    const handleClear = async () => {
        setSearchByTitle("");
        setSearchByArtist("");
        setSearchByYear("");
        await store.loadSongs();
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }

    const handleSongClick = (song) => {
        setSelectedSong(song);
    }

    const handleSongMenuOpen = (event, song) => {
        event.stopPropagation();
        setSongMenuAnchor(event.currentTarget);
        setSelectedSongForMenu(song);
    }

    const handleSongMenuClose = () => {
        setSongMenuAnchor(null);
        setSelectedSongForMenu(null);
        setAddToPlaylistAnchor(null);
    }

    const handleEditSong = (song) => {
        const index = store.songs.findIndex(s => s.id === song.id);
        store.showEditSongModal(song.id, index);
        handleSongMenuClose();
    }

    const handleDeleteSong = (song) => {
        store.markSongForDeletion(song);
        handleSongMenuClose();
    }

    const handleAddToPlaylistClick = (event, song) => {
        event.stopPropagation();
        setSelectedSongForMenu(song);
        const anchorElement = addToPlaylistMenuItemRef.current || event.currentTarget;
        setAddToPlaylistAnchor(anchorElement);
    }

    let editSongModal = "";
    if (store.currentModal === "EDIT_SONG")
        editSongModal = <EditSongModal />
    let deleteSongModal = "";
    if (store.currentModal === "DELETE_SONG")
        deleteSongModal = <DeleteSongModal />

    return (
        <Box className="screen"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "77vh", border: "1px solid black", position: "relative" }}
        >
            <Box sx={{ width: "49%", height: "100%", position: "relative" }}>
                <Box sx={{ position: "relative", top: "20px", left: "20px", zIndex: 1000 }}>
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 900, color: "#C20CB9", marginBottom: "20px" }}>
                        Songs Catalog
                    </Typography>
                    <ClearableTextField 
                        value={searchByTitle} 
                        label={"by Title"} 
                        setInputValue={setSearchByTitle} 
                        setWidth={450}
                        onKeyPress={handleKeyPress}
                    />
                    <Box sx={{ marginTop: "15px" }}>
                        <ClearableTextField 
                            value={searchByArtist} 
                            label={"by Artist"} 
                            setInputValue={setSearchByArtist} 
                            setWidth={450}
                            onKeyPress={handleKeyPress}
                        />
                    </Box>
                    <Box sx={{ marginTop: "15px" }}>
                        <ClearableTextField 
                            value={searchByYear} 
                            label={"by Year"} 
                            setInputValue={setSearchByYear} 
                            setWidth={450}
                            onKeyPress={handleKeyPress}
                        />
                    </Box>
                    <Box sx={{ display: "flex", width: "450px", marginTop: "20px" }}>
                        <Button variant="contained" onClick={handleSearch}
                        sx={{ width: "fit-content", height: "37px", backgroundColor: "#2C2C2C", textTransform: "none", borderRadius: "100px" }}>
                            <SearchIcon />
                            Search
                        </Button>
                        <Box sx={{ flexGrow: 1 }} />
                        <Button variant="contained" onClick={handleClear}
                        sx={{ width: "fit-content", height: "37px", backgroundColor: "#2C2C2C", textTransform: "none", borderRadius: "100px" }}>
                            Clear
                        </Button>
                    </Box>
                </Box>
                {selectedSong && (
                    <Box sx={{ position: "relative", marginTop: "50px", marginLeft: "10px", zIndex: 1000 }}>
                        <YouTubePlayer videoId={selectedSong.youTubeId} showControls={false} />
                    </Box>
                )}
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
                            {store.songs.length} Song{store.songs.length !== 1 ? 's' : ''}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", height: "70%", marginTop: "50px", overflow: "auto" }}>
                    {store.songs.map(song => {
                        const isSelected = selectedSong && selectedSong.id === song.id;
                        const isOwner = auth.user && auth.user.userId === song.ownerId;
                        return (
                            <Box 
                                key={song.id}
                                onClick={() => handleSongClick(song)}
                                sx={{
                                    padding: "15px",
                                    marginBottom: "10px",
                                    backgroundColor: isSelected ? "#FFF9C4" : "white",
                                    border: isOwner ? "2px solid blue" : "1px solid gray",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" component="h6" sx={{ fontSize: "16px", fontWeight: "bold" }}>
                                        {song.title} by {song.artist} ({song.year})
                                    </Typography>
                                    <Typography variant="body2" component="h6" sx={{ fontSize: "13px", marginTop: "5px" }}>
                                        Listens: {song.listenCount?.toLocaleString() || 0} | Playlists: {song.playlistCount || 0}
                                    </Typography>
                                </Box>
                                {auth.user && (
                                    <Button
                                        onClick={(e) => handleSongMenuOpen(e, song)}
                                        sx={{ minWidth: "40px" }}
                                    >
                                        <MoreVertIcon />
                                    </Button>
                                )}
                            </Box>
                        )
                    })}
                </Box>
                {auth.user && (
                    <Button variant="contained" onClick={handleCreateNewSong}
                    sx={{ width: "fit-content", height: "37px", marginTop: "57px", backgroundColor: "#2C2C2C", textTransform: "none", borderRadius: "100px" }}>
                        <AddCircleOutlineIcon sx={{ marginRight: "5px" }}/>
                        New Song
                    </Button>
                )}
            </Box>
            {auth.user && selectedSongForMenu && (
                <Menu
                    anchorEl={songMenuAnchor}
                    open={Boolean(songMenuAnchor)}
                    onClose={handleSongMenuClose}
                >
                    <MenuItem 
                        ref={addToPlaylistMenuItemRef}
                        onClick={(e) => handleAddToPlaylistClick(e, selectedSongForMenu)}
                    >
                        Add to Playlist
                    </MenuItem>
                    {selectedSongForMenu.ownerId === auth.user.userId && (
                        <MenuItem onClick={() => handleEditSong(selectedSongForMenu)}>
                            Edit Song
                        </MenuItem>
                    )}
                    {selectedSongForMenu.ownerId === auth.user.userId && (
                        <MenuItem onClick={() => handleDeleteSong(selectedSongForMenu)}>
                            Remove from Catalog
                        </MenuItem>
                    )}
                </Menu>
            )}
            {selectedSongForMenu && addToPlaylistAnchor && (
                <AddToPlaylistMenu 
                    song={selectedSongForMenu}
                    anchorEl={addToPlaylistAnchor}
                    onClose={() => {
                        setAddToPlaylistAnchor(null);
                    }}
                />
            )}
            { editSongModal }
            { deleteSongModal }
        </Box>
    )
}
export default SongsCatalogScreen;

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useState, useContext } from 'react';
import GlobalStoreContext from '../store/GlobalStoreContextProvider';
import ClearableTextField from '../components/ClearableTextField';

const PlaylistsScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    const [searchByPlaylistName, setSearchByPlaylistName] = useState("");
    const [searchByUserName, setSearchByUserName] = useState("");
    const [searchBySongTitle, setSearchBySongTitle] = useState("");
    const [searchBySongArtist, setSearchBySongArtist] = useState("");
    const [searchBySongYear, setSearchBySongYear] = useState("");

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
                    <Box>
                        <Typography variant="h5" component="h3" sx={{ fontWeight: 500 }}>
                            Sort:
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}/>
                    <Box>
                        <Typography variant="h5" component="h3" sx={{ fontWeight: 500 }}>
                            Playlists
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", height: "70%", marginTop: "50px" }}>
                    TODO
                </Box>
                <Button variant="contained" onClick={null}
                sx={{ width: "fit-content", height: "37px", marginTop: "57px", backgroundColor: "#2C2C2C", textTransform: "none", borderRadius: "100px" }}>
                    <AddCircleOutlineIcon sx={{ marginRight: "5px" }}/>
                    New Playlist
                </Button>
            </Box>
        </Box>
    )
}
export default PlaylistsScreen;
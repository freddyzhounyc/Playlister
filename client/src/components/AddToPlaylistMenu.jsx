import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState, useContext, useEffect } from 'react';
import GlobalStoreContext from '../store/GlobalStoreContextProvider';
import AuthContext from '../auth/AuthContextProvider';

const AddToPlaylistMenu = ({ song, anchorEl, onClose }) => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [playlists, setPlaylists] = useState([]);
    const [menuAnchor, setMenuAnchor] = useState(null);

    useEffect(() => {
        if (song && auth.user && anchorEl) {
            loadUserPlaylists();
            setMenuAnchor(anchorEl);
        } else {
            setMenuAnchor(null);
        }
    }, [song, auth.user, anchorEl]);

    const loadUserPlaylists = async () => {
        try {
            await store.loadPlaylists();
            const userPlaylists = store.playlists
                .filter(p => p.ownerId === auth.user.userId)
                .sort((a, b) => {
                    return b.id - a.id;
                });
            setPlaylists(userPlaylists);
        } catch (err) {
            console.log(err.message);
        }
    }

    const handleMenuClose = () => {
        setMenuAnchor(null);
        onClose();
    }

    const handleAddToPlaylist = async (playlistId) => {
        try {
            await store.addSongToPlaylist(song.id, playlistId);
            setMenuAnchor(null);
            onClose();
        } catch (err) {
            console.log(err.message);
        }
    }

    if (!song || !auth.user || !menuAnchor) {
        return null;
    }

    return (
        <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            {playlists.length === 0 ? (
                <MenuItem disabled>No playlists available</MenuItem>
            ) : (
                playlists.map(playlist => (
                    <MenuItem 
                        key={playlist.id}
                        onClick={() => handleAddToPlaylist(playlist.id)}
                        sx={{ "&:hover": { backgroundColor: "rgba(200, 12, 185, 0.3)" } }}
                    >
                        {playlist.name}
                    </MenuItem>
                ))
            )}
        </Menu>
    )
}
export default AddToPlaylistMenu;

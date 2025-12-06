import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth/AuthContextProvider';

const PlaylisterAppBar = () => {
    const { auth } = useContext(AuthContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleMenuClose = () => {
        setAnchorEl(null);
    }
    const handleMenuCloseLogin = () => {
        setAnchorEl(null);
        navigate("/login")
    }
    const handleMenuCloseRegister = () => {
        setAnchorEl(null);
        navigate("/register")
    }
    const handleMenuCloseEditAccount = () => {
        setAnchorEl(null);
        navigate("/editAccount")
    }
    const handleMenuCloseLogout = () => {
        setAnchorEl(null);
        auth.logoutUser(); // Sends user to "/"
    }
    const handleClickPlaylists = (event) => {
        navigate("/playlists");
    }
    const handleClickSongCatalog = (event) => {
        navigate("/songs");
    }

    const menuId = "primary-search-account-menu";
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuCloseLogin} 
            sx={{
                "&:hover": {
                    backgroundColor: "rgba(58, 151, 240, 0.3)"
                }
            }}>Login</MenuItem>
            <MenuItem onClick={handleMenuCloseRegister}
            sx={{
                "&:hover": {
                    backgroundColor: "rgba(58, 151, 240, 0.3)"
                }
            }}>Create Account</MenuItem>
        </Menu>
    );
    const loggedInMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuCloseEditAccount} 
            sx={{
                "&:hover": {
                    backgroundColor: "rgba(58, 151, 240, 0.3)"
                }
            }}>Edit Account</MenuItem>
            <MenuItem onClick={handleMenuCloseLogout}
            sx={{
                "&:hover": {
                    backgroundColor: "rgba(58, 151, 240, 0.3)"
                }
            }}>Logout</MenuItem>
        </Menu>
    );
    const accountIconLoggedOut = (
        <Avatar sx={{ width: 50, height: 50, backgroundColor: "white" }}>
            <PersonIcon sx={{ fontSize: 35, color: "black" }}/>
        </Avatar>
    );

    let menu = loggedOutMenu;
    let accountIcon = accountIconLoggedOut;
    if (auth.loggedIn) {
        menu = loggedInMenu;
        accountIcon = (
            <Avatar src={auth.user.profileImage} sx={{ width: 50, height: 50, backgroundColor: "white" }} />
        );
    }

    // 1B4079
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: "#EE06FF", border: "1px solid, black" }}>
                <Toolbar sx={{ height: "70px" }}>
                    <Typography                        
                        variant="h3"
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}                        
                    >
                        <Link style={{ textDecoration: 'none', color: 'white' }} to='/'>
                            <Avatar sx={{ width: 50, height: 50, backgroundColor: "white" }}>
                                <HomeFilledIcon sx={{ fontSize: 35, color: "black" }}/>
                            </Avatar>
                        </Link>
                    </Typography>
                    <Box>
                        <Button variant="contained" onClick={handleClickPlaylists}
                        sx={{ width: "auto", height: "37px", marginLeft: "15px", backgroundColor: "#2C2C2C", textTransform: "none" }}>
                            Playlists
                        </Button>
                        <Button variant="contained" onClick={handleClickSongCatalog}
                        sx={{ width: "auto", height: "37px", marginLeft: "15px", backgroundColor: "#3A64C4", textTransform: "none" }}>
                            Song Catalog
                        </Button>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Typography variant="h4" component="h2" sx={{}}>
                        The Playlister
                    </Typography>
                    <Box sx={{ flexGrow: 2.5 }}></Box>
                    <Box sx={{ height: "70px", display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            { accountIcon }
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            { menu }
        </Box>
    );
}
export default PlaylisterAppBar;
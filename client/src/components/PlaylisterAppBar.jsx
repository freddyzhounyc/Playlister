import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PlaylisterAppBar = () => {
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
        navigate("/edit_account")
    }
    // TODO handleMenuCloseLogout

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
            <MenuItem onClick={handleMenuClose}
            sx={{
                "&:hover": {
                    backgroundColor: "rgba(58, 151, 240, 0.3)"
                }
            }}>Logout</MenuItem>
        </Menu>
    );

    let menu = loggedOutMenu;

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
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
                    <Box sx={{ flexGrow: 1 }}></Box>
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
                            <Avatar sx={{ width: 50, height: 50, backgroundColor: "white" }}>
                                <PersonIcon sx={{ fontSize: 35, color: "black" }}/>
                            </Avatar>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            { menu }
        </Box>
    );
}
export default PlaylisterAppBar;
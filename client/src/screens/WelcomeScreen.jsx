import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen = () => {
    const navigate = useNavigate();

    const handleContinueAsGuest = (event) => {
        navigate("/playlists");
    }
    const handleLogin = (event) => {
        navigate("/login");
    }
    const handleCreateAccount = (event) => {
        navigate("/register");
    }

    return (
        <Box className="screen" 
        sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "77vh", border: "1px solid, black"}}>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"}}>
                <Typography variant="h2" component="h1" fontWeight={500}>
                    The Playlister
                </Typography>
                <QueueMusicIcon sx={{ fontSize: 300 }}/>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "50px", marginTop: "30px" }}>
                <Button variant="contained" onClick={handleContinueAsGuest}
                sx={{ width: "180px", backgroundColor: "#2C2C2C", textTransform: "none" }}>
                    Continue as Guest
                </Button>
                <Button variant="contained" onClick={handleLogin}
                sx={{ width: "180px", backgroundColor: "#2C2C2C", textTransform: "none" }}>
                    Login
                </Button>
                <Button variant="contained" onClick={handleCreateAccount}
                sx={{ width: "180px", backgroundColor: "#2C2C2C", textTransform: "none" }}>
                    Create Account
                </Button>
            </Box>
        </Box>
    )
}
export default WelcomeScreen;
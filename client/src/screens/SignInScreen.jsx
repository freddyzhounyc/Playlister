import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth/AuthContextProvider'
import Copyright from '../components/Copyright';
import ClearableTextField from '../components/ClearableTextField';

const SignInScreen = () => {
    const { auth } = useContext(AuthContext);
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const navigate = useNavigate();

    const handleSignIn = (event) => {
        event.preventDefault();
        auth.loginUser(emailInput, passwordInput);
    }
    const handleGoToRegister = (event) => {
        navigate("/register");
    }

    return (
        <Box className="screen" sx={{ height: "77vh", border: "1px solid, black" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    <LockOutlineIcon sx={{ fontSize: "55px", marginBottom: "5px" }}/>
                    <Typography variant="h5" component="h1" sx={{ fontSize: "30px", marginBottom: "37px" }}>
                        Sign In
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                    <ClearableTextField value={emailInput} label="Email" setInputValue={setEmailInput}/>
                    <ClearableTextField value={passwordInput} label="Password" type="password" setInputValue={setPasswordInput}/>
                </Box>
                <Button variant="contained" onClick={handleSignIn}
                sx={{ width: "525px", height: "37px", marginTop: "40px", backgroundColor: "#2C2C2C", textTransform: "none" }}>
                    Sign In
                </Button>
                <Link underline="none" onClick={handleGoToRegister} sx={{ marginTop: "10px", color: "red", "&:hover": { cursor: "pointer" } }}>
                    Don't have an account? Sign Up
                </Link>
                <Copyright sx={{ marginTop: "200px" }}/>
            </Box>
        </Box>
    );
}
export default SignInScreen;
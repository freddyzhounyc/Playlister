import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth/AuthContextProvider'
import Copyright from '../components/Copyright';
import ClearableTextField from '../components/ClearableTextField';

const RegisterScreen = () => {
    const { auth } = useContext(AuthContext);
    const [avatarInput, setAvatarInput] = useState("");
    const [userNameInput, setUserNameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [passwordConfirmInput, setPasswordConfirmInput] = useState("");
    const filePickerRef = useRef(null);
    const navigate = useNavigate();

    const handleCreateAccount = (event) => {
        event.preventDefault();
        auth.registerUser(avatarInput, userNameInput, emailInput, passwordInput, passwordConfirmInput);
    }
    const handleGoToSignIn = (event) => {
        navigate("/login");
    }
    const handleSelectAvatar = (event) => {
        filePickerRef.current.click();
    }
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file)
            return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            setAvatarInput(e.target.result);
        }
        reader.readAsDataURL(file);
    }

    return (
        <Box className="screen" sx={{ height: "77vh", border: "1px solid black" }}>
            <Box 
            sx={{ marginTop: "-25px", position: "relative", top: 210, left: 210, display: "flex", flexDirection: "column", alignItems: "center", width: "fit-content", justifyContent: "center" }}>
                <Avatar src={avatarInput} sx={{ width: 50, height: 50 }}/>
                <Button variant="contained" onClick={handleSelectAvatar}
                sx={{ fontSize: "12px", width: "77px", height: "20px", marginTop: "3px", backgroundColor: "#2C2C2C", textTransform: "none" }}>
                    Select *
                    <input type="file" accept="image/*" onChange={handleFileSelect} ref={filePickerRef} hidden/>
                </Button>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    <LockOutlineIcon sx={{ fontSize: "55px", marginBottom: "5px" }}/>
                    <Typography variant="h5" component="h1" sx={{ fontSize: "30px", marginBottom: "37px" }}>
                        Create Account
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                    <ClearableTextField value={userNameInput} label="User Name" setInputValue={setUserNameInput} setWidth={525} setRequired={true}/>
                    <ClearableTextField value={emailInput} label="Email" setInputValue={setEmailInput} setWidth={525} setRequired={true}/>
                    <ClearableTextField value={passwordInput} label="Password" type="password" setInputValue={setPasswordInput} setWidth={525} setRequired={true}/>
                    <ClearableTextField value={passwordConfirmInput} label="Password Confirm" type="password" setInputValue={setPasswordConfirmInput} setWidth={525} setRequired={true}/>
                </Box>
                <Button variant="contained" onClick={handleCreateAccount}
                sx={{ width: "525px", height: "37px", marginTop: "40px", backgroundColor: "#2C2C2C", textTransform: "none" }}>
                    Create Account
                </Button>
                <Link underline="none" onClick={handleGoToSignIn} sx={{ marginTop: "10px", color: "red", "&:hover": { cursor: "pointer" } }}>
                    Already have an account? Sign In
                </Link>
                <Copyright sx={{ marginTop: "70px" }}/>
            </Box>
        </Box>
    )
}
export default RegisterScreen;
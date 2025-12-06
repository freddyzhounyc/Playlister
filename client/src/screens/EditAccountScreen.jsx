import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth/AuthContextProvider';
import GlobalStoreContext from '../store/GlobalStoreContextProvider';
import Copyright from '../components/Copyright';
import ClearableTextField from '../components/ClearableTextField';

const EditAccountScreen = () => {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const [avatarInput, setAvatarInput] = useState("");
    const [userNameInput, setUserNameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [passwordConfirmInput, setPasswordConfirmInput] = useState("");
    const filePickerRef = useRef(null);
    const navigate = useNavigate();

    // Not logged in!
    useEffect(() => {
        if (!auth.user)
            navigate("/login");
    }, []);

    const handleConfirmAccountEdit = (event) => {
        event.preventDefault();
        store.updateUser({ 
            profileImage: avatarInput,
            userName: userNameInput,
            email: emailInput,
            password: passwordInput,
            passwordVerify: passwordConfirmInput
        });
    }
    const handleCancelAccountEdit = (event) => {
        navigate(-1);
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
        <Box className="screen" sx={{ height: "77vh", border: "1px solid, black" }}>
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
                        Edit Account
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                    <ClearableTextField value={userNameInput} label="User Name" setInputValue={setUserNameInput}/>
                    <ClearableTextField value={emailInput} label="Email" setInputValue={setEmailInput}/>
                    <ClearableTextField value={passwordInput} label="Password" type="password" setInputValue={setPasswordInput}/>
                    <ClearableTextField value={passwordConfirmInput} label="Password Confirm" type="password" setInputValue={setPasswordConfirmInput}/>
                </Box>
                <Box sx={{ display: "flex", gap: "20px" }}>
                    <Button variant="contained" onClick={handleConfirmAccountEdit}
                    sx={{ width: "252px", height: "37px", marginTop: "40px", backgroundColor: "#2C2C2C", textTransform: "none" }}>
                        Complete
                    </Button>
                    <Button variant="contained" onClick={handleCancelAccountEdit}
                    sx={{ width: "252px", height: "37px", marginTop: "40px", backgroundColor: "#2C2C2C", textTransform: "none" }}>
                        Cancel
                    </Button>
                </Box>
                <Copyright sx={{ marginTop: "70px" }}/>
            </Box>
        </Box>
    )
}
export default EditAccountScreen;
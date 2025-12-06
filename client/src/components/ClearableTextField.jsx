import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from "@mui/material/InputAdornment";

const ClearableTextField = ({ value, label, type, setInputValue }) => {
    return (
        <TextField required value={value} label={label} variant="filled" type={type} onChange={(event) => setInputValue(event.target.value)} 
        sx={{ width: "525px" }} 
        slotProps={{
            input: {
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={ (event) => setInputValue("") } edge="end" size="small" sx={{ mr: -1 }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </InputAdornment>
                )
            }
        }}/>
    );
}
export default ClearableTextField;
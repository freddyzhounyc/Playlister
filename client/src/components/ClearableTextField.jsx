import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from "@mui/material/InputAdornment";

const ClearableTextField = ({ value, label, type, setInputValue, setWidth, setRequired }) => {
    return (
        <TextField required={setRequired} value={value} label={label} variant="filled" type={type} onChange={(event) => setInputValue(event.target.value)} 
        sx={{ width: setWidth + "px" }} 
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
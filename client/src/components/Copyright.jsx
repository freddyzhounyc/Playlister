import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const Copyright = (props) => {
    return (
        <Typography variant="body2" color="black" align="center" {...props}>
            {"Copyright © "}
            <Link color="inherit" href="/">
                Playlister
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}
export default Copyright;
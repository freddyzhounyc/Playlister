import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const PlayPlaylistModalSongCard = ({ song, num, selected }) => {
    return (
        <Box sx={{ flexShrink: 0, width: "95%", height: "10%", backgroundColor: selected ? "#F7E965" : "#FFF7B2", marginTop: "10px", borderRadius: "7px", border: "1px solid black" }}>
            <Box sx={{ display: "flex", flexDirection: "row", marginTop: "12px", marginLeft: "10px" }}>
                <Typography variant="body1" component="h6" sx={{ fontSize: "21px", color: selected ? "#C20CB9" : "#1E1E1E" }}>
                    {num + "."}
                </Typography>
                <Typography variant="body1" component="h6" sx={{ fontSize: "19px", marginLeft: "5px", marginTop: "2px", fontWeight: "550", color: selected ? "#C20CB9" : "#1E1E1E" }}>
                    {song.title + " by " + song.artist + " (" + song.year + ")"}
                </Typography>
            </Box>
        </Box>
    );
}
export default PlayPlaylistModalSongCard;
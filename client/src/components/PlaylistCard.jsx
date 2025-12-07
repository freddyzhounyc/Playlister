import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const PlaylistCard = () => {
    return (
        <Accordion sx={{ marginBottom: "20px", width: "97%" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ marginTop: "50px" }}/>}>
                <Paper elevation={0} sx={{ height: "100%", width: "100%", backgroundColor: 'transparent', display: "flex", flexDirection: "row" }}>
                    <Box sx={{ display: "flex" }}>
                        <Avatar sx={{ width: 50, height: 50, marginLeft: "-7px", backgroundColor: "grey" }} />
                        <Box sx={{ display: "flex", flexDirection: "column", marginTop: "2px", marginLeft: "10px", width: "90%" }}>
                            <Typography variant="h6" component="body1" sx={{ fontSize: "18px", width: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                Don't be Rude
                            </Typography>
                            <Typography variant="body2" component="body2" sx={{ fontSize: "13px", marginTop: "-5px" }}>
                                JoeShmo
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: "flex", flexDirection: "row-reverse", gap: "3px" }}>
                        <Button variant="contained" onClick={null}
                        sx={{ fontSize: "13px", width: "fit-content", height: "30px", marginTop: "10px", marginRight: "-35px", backgroundColor: "#DE24BC", textTransform: "none", borderRadius: "7px", border: "1px solid black" }}>
                            Play
                        </Button>
                        <Button variant="contained" onClick={null}
                        sx={{ fontSize: "13px", width: "fit-content", height: "30px", marginTop: "10px", backgroundColor: "#077836", textTransform: "none", borderRadius: "7px", border: "1px solid black" }}>
                            Copy
                        </Button>
                        <Button variant="contained" onClick={null}
                        sx={{ fontSize: "13px", width: "fit-content", height: "30px", marginTop: "10px", backgroundColor: "#3A64C4", textTransform: "none", borderRadius: "7px", border: "1px solid black" }}>
                            Edit
                        </Button>
                        <Button variant="contained" onClick={null}
                        sx={{ fontSize: "13px", width: "fit-content", height: "30px", marginTop: "10px", backgroundColor: "#D2292F", textTransform: "none", borderRadius: "7px", border: "1px solid black" }}>
                            Delete
                        </Button>
                    </Box>
                </Paper>
            </AccordionSummary>
            <AccordionDetails>

            </AccordionDetails>
        </Accordion>
    )
}
export default PlaylistCard;
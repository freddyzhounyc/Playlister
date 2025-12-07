import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { useEffect, useRef, useState } from "react";

const YouTubePlayer = ({ videoId, handleSongSkipPrevious, handleSongSkipNext }) => {
    const playerRef = useRef(null);
    const containerRef = useRef(null);

    const [paused, setPaused] = useState(false);
    const [apiReady, setApiReady] = useState(false);

    useEffect(() => {
        if (window.YT && window.YT.Player) {
            setApiReady(true);
            return;
        }

        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";

        window.onYouTubeIframeAPIReady = () => {
            setApiReady(true);
        };

        document.body.appendChild(tag);
    }, []);

    useEffect(() => {
        if (!apiReady) return;

        if (playerRef.current) {
            playerRef.current.loadVideoById(videoId);
            return;
        }

        playerRef.current = new window.YT.Player(containerRef.current, {
            height: "290",
            width: "470",
            videoId: videoId,
            playerVars: { playsinline: 1 },
            events: {
                onReady: (event) => {
                    event.target.playVideo();
                    setPaused(false);
                },
                onStateChange: (event) => {
                    if (event.data === window.YT.PlayerState.PLAYING)
                        setPaused(false);
                    else if (event.data === window.YT.PlayerState.PAUSED)
                        setPaused(true);
                    else if (event.data === window.YT.PlayerState.ENDED)
                        handleSongEnd();
                }
            }
        });
    }, [apiReady, videoId]);

    const handlePausePlay = (event) => {
        if (paused)
            playerRef.current.playVideo();
        else
            playerRef.current.pauseVideo();
    }
    const handleSongEnd = (event) => {
        setPaused(true);
        handleSongSkipNext();
    }

    return (
        <Box>
            <div ref={containerRef}></div>
            <Box sx={{ display: "flex", marginLeft: "140px" }}>
                <Button variant="contained" onClick={handleSongSkipPrevious}
                sx={{ width: "fit-content", height: "37px", marginTop: "40px", backgroundColor: "#2C2C2C", textTransform: "none", borderRadius: "0px" }}>
                    <SkipPreviousIcon />
                </Button>
                <Button variant="contained" onClick={handlePausePlay}
                sx={{ width: "fit-content", height: "37px", marginTop: "40px", backgroundColor: "#2C2C2C", textTransform: "none", borderRadius: "0px" }}>
                    {paused ? <PlayArrowIcon /> : <PauseIcon /> }
                </Button>
                <Button variant="contained" onClick={handleSongSkipNext}
                sx={{ width: "fit-content", height: "37px", marginTop: "40px", backgroundColor: "#2C2C2C", textTransform: "none", borderRadius: "0px" }}>
                    <SkipNextIcon />
                </Button>
            </Box>
        </Box>
    );
}
export default YouTubePlayer;
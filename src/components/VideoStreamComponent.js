import React from "react";
import {
  Box
} from '@mui/material';
import VideoCard from "./VideoCard";


const VideoStreamComponent = () => {
  return (
    <Box p={2} sx={{maxWidth: '100%' }}>
        <VideoCard />
    </Box>
  );
}

export default VideoStreamComponent;

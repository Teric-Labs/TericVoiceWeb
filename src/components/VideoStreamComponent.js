import React from "react";
import {
  Box, Card, CardContent
} from '@mui/material';
import VideoCard from "./VideoCard";


const VideoStreamComponent = () => {
  return (
    <Box p={2} sx={{ margin: 'auto', maxWidth: '100%' }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2, marginBottom: '20px', position: 'relative' }}>
        <CardContent>
        <VideoCard />
        </CardContent>
      </Card>
    </Box>
  );
}

export default VideoStreamComponent;

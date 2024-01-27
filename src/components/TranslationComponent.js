import React from "react";
import {Box, Typography} from '@mui/material'
import uploadfile from '../assets/uploadfile.png'
import VideoCard from "./VideoCard";
import VideoTable from "./VideoTable";
const TranslationComponent =()=>{
    return(   
        <Box>
            <Typography variant="h4" gutterBottom sx={{margin:2}}>
            Video Streaming
        </Typography>
             <Box container spacing={1}>
                <VideoCard/>
            </Box>
            <Box p={3 } id="audio" sx={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <VideoTable/>
            </Box>
        </Box>
    )
}

export default TranslationComponent;
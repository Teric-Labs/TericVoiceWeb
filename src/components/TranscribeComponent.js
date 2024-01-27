import React from "react";
import {Box, Typography} from '@mui/material'
import uploadfile from '../assets/uploadfile.png'
import CustomPanel from "./CustomPanel";
import DataTable from "./DataTable";
const TranscribeComponent =()=>{
    return(
        <Box p={3}>
            <Typography variant="h4" gutterBottom sx={{margin:2}}>
             Upload Audio Files For Transcription
            </Typography>
            <Box>
            <Box container spacing={1}>
                <CustomPanel heading="Upload" value="" imageUrl={uploadfile} />
            </Box>
            </Box>
            <Box p={3 } id="audio" sx={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <DataTable/>
            </Box>
        </Box>
    )
}

export default TranscribeComponent;
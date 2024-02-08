import React from "react";
import {Box, Typography} from '@mui/material'
import SpeechToSpeechForm from "./SpeechToSpeechForm";
const Voice2VoiceComponent =()=>{
    return(   
        <Box>
            
             <Box container spacing={1}>
                <SpeechToSpeechForm/>
            </Box>
        </Box>
    )
}

export default Voice2VoiceComponent;
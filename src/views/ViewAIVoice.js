import React from "react";
import { Box} from "@mui/material";
import VoiceAssistant from "../components/VoiceAssistant";
import { useParams } from 'react-router-dom';
const ViewAIVoice =()=>{
    const { id } = useParams();
    return(
        <Box>
            <VoiceAssistant agentId={id}/>
        </Box>
    )
}

export default ViewAIVoice ;
import React from "react";
import { Box} from "@mui/material";
import ViewttsAudioComponent from "../components/ViewttsAudioComponent";
import { useParams } from 'react-router-dom';
const ViewttsAudio =()=>{
    const { id } = useParams();
    return(
        <Box>
            <ViewttsAudioComponent audioId={id}/>
        </Box>
    )
}

export default ViewttsAudio ;
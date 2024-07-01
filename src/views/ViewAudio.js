import React from "react";
import { Box} from "@mui/material";
import ViewAudioComponent from "../components/ViewAudioComponent";
import { useParams } from 'react-router-dom';
const ViewAudio =()=>{
    const { id } = useParams();
    return(
        <Box>
            <ViewAudioComponent audioId={id}/>
        </Box>
    )
}

export default ViewAudio ;
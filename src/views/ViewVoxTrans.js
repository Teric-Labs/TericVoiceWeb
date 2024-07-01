import React from "react";
import { Box} from "@mui/material";
import ViewVoxComponent from "../components/ViewVoxComponent";
import { useParams } from 'react-router-dom';
const ViewVoxTrans=()=>{
    const { id } = useParams();
    return(
        <Box>
            <ViewVoxComponent voiceId={id}/>
        </Box>
    )
}

export default ViewVoxTrans ;
import React from "react";
import { Box} from "@mui/material";
import Chats from "../components/Chats";
import { useParams } from 'react-router-dom';
const ViewChat =()=>{
    const { id } = useParams();
    return(
        <Box>
            <Chats agentId={id}/>
        </Box>
    )
}

export default ViewChat ;
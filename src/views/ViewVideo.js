import React from "react";
import { Box} from "@mui/material";
import ViewVideoComponent from "../components/ViewVideoComponent"
import { useParams } from 'react-router-dom';

const ViewVideo =()=>{
    const { id } = useParams();
    console.log(id);
    return(
        <Box>
            <ViewVideoComponent audioId={id}/>
        </Box>
    )
}

export default ViewVideo ;
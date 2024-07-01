import React from "react";
import { Box} from "@mui/material";
import ViewSummaryComponent from "../components/ViewSummaryComponent ";
import { useParams } from 'react-router-dom';
const ViewSummary =()=>{
    const { id } = useParams();
    return(
        <Box>
            <ViewSummaryComponent translationId={id}/>
        </Box>
    )
}

export default ViewSummary ;
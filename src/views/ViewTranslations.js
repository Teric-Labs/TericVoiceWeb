import React from "react";
import { Box} from "@mui/material";
import ViewTranslationsComponent from "../components/ViewTranslationsComponent ";
import { useParams } from 'react-router-dom';
const ViewTranslations =()=>{
    const { id } = useParams();
    return(
        <Box>
            <ViewTranslationsComponent translationId={id}/>
        </Box>
    )
}

export default ViewTranslations ;
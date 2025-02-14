import React from "react";
import { Box} from "@mui/material";
import LanguageMatrix from "../components/LanguageMatrix";
import AppBarComponent from "../components/AppBarComponent.js";
import FooterComponent from '../components/FooterComponent.js'

const LanguageView =()=>{
    return(
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
        <AppBarComponent/>
        <Box sx={{ flexGrow: 1 }}>
        <LanguageMatrix/> 
        </Box>
        <FooterComponent/>
        </Box>
    )
}

export default LanguageView;
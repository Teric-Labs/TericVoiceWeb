import React from "react";
import {Box} from '@mui/material'
import Documentation from "../components/Documentation.js";
import AppBarComponent from "../components/AppBarComponent.js";
import FooterComponent from '../components/FooterComponent.js'
const APIReference =()=>{
    return(
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
        <AppBarComponent/>
        <Box sx={{ flexGrow: 1 }}>
        <Documentation/> 
        </Box>
        <FooterComponent/>
        </Box>
    );
}
export default APIReference;
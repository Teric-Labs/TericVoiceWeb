import React from "react";
import {Box} from '@mui/material'
import APiComponet from "../components/ApiComponent.js";
import AppBarComponent from "../components/AppBarComponent.js";
import FooterComponent from '../components/FooterComponent.js'
const APis =()=>{
    return(
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
        <AppBarComponent/>
        <Box sx={{ flexGrow: 1 }}>
        <APiComponet/> 
        </Box>
        <FooterComponent/>
        </Box>
    );
}
export default APis;
import React from "react";
import {Box} from '@mui/material'
import Wellcome from "../components/Wellcome";
import AppBarComponent from "../components/AppBarComponent";
import FooterComponent from './../components/FooterComponent.js'
const GetStarted =()=>{
    return(
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
        <AppBarComponent/>
        <Box sx={{ flexGrow: 1 }}>
        <Wellcome/> 
        </Box>
        <FooterComponent/>
        </Box>
    );
}
export default GetStarted;
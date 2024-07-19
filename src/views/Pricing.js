import React from "react";
import {Box} from '@mui/material'
import PricingComponet from "../components/PricingComponet.js";
import AppBarComponent from "../components/AppBarComponent.js";
import FooterComponent from '../components/FooterComponent.js'
const Pricing =()=>{
    return(
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
        <AppBarComponent/>
        <Box sx={{ flexGrow: 1 }}>
        <PricingComponet/> 
        </Box>
        <FooterComponent/>
        </Box>
    );
}
export default Pricing;
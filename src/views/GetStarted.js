import React from "react";

import Wellcome from "../components/Wellcome";
import AppBarComponent from "../components/AppBarComponent";
import FooterComponent from './../components/FooterComponent.js'
const GetStarted =()=>{
    return(
        <>
        <AppBarComponent/>
        <Wellcome/> 
        <FooterComponent/>
        </>
    );
}
export default GetStarted;
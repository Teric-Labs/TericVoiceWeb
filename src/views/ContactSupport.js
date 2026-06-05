import React from "react";
import { Box} from "@mui/material";
import ContactComponent from "../components/ContactComponent";

const ContactSupport =()=>{
    return(
        <Box sx={{ background: 'transparent', minHeight: '100vh', width: '100%' }}>
            <ContactComponent/>
        </Box>
    )
}

export default ContactSupport;
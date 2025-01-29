import React, { useState, useEffect } from "react";
import { Box,Card, CardContent } from '@mui/material';
import TranslationCard from "./TranslationCard";

const TranslationComponent = () => {
  const [user, setUser] = useState({ username: '', userId: '' });

 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  return (
    <Box sx={{maxWidth: '100%', p: 2 }}>
         <TranslationCard />
    </Box>
  );
}

export default TranslationComponent;

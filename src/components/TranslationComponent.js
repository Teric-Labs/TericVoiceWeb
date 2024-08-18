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
    <Box sx={{ margin: 'auto', maxWidth: '100%', p: 2 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2, mb: 3 }}>
        <CardContent>
         <TranslationCard />
        </CardContent>
      </Card>
      
    </Box>
  );
}

export default TranslationComponent;

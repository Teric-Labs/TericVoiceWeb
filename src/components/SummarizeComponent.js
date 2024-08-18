import React, { useState, useEffect } from "react";
import { Box,useTheme, Card, CardContent} from '@mui/material';
import SummarizationCard from "./SummarizationCard";

const SummarizeComponent = () => {
  const [user, setUser] = useState({ username: '', userId: '' });

 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      console.log(user.userId);
    }
  }, []);

  return (
    <Box sx={{ margin: 'auto', Width: '100%', p: 2 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2, mb: 3 }}>
        <CardContent>
          <SummarizationCard />
          </CardContent>
      </Card>
      
    </Box>
  );
}

export default SummarizeComponent;

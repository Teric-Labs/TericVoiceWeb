import React, { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import VoiceoverStudio from '../components/VoiceoverStudio';

const VoiceoverView = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserId(user.uid || user.userId);
  }, []);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', background: 'transparent' }}>
      <Container maxWidth="xl">
        {userId && <VoiceoverStudio userId={userId} />}
      </Container>
    </Box>
  );
};

export default VoiceoverView;

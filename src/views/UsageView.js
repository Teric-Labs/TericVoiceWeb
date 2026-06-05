import React, { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import UsageAnalytics from '../components/UsageAnalytics';

const UsageView = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserId(userData.uid || userData.userId);
      } catch (e) {
        console.error("Failed to parse user for UsageView", e);
      }
    }
  }, []);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', background: 'transparent', py: 6 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#111111', mb: 1 }}>
            Usage Analytics
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(17, 17, 17, 0.5)' }}>
            Monitor your credit consumption and service usage patterns.
          </Typography>
        </Box>
        {userId ? (
          <UsageAnalytics userId={userId} />
        ) : (
          <Typography sx={{ color: '#111111' }}>Please log in to view analytics.</Typography>
        )}
      </Container>
    </Box>
  );
};

export default UsageView;

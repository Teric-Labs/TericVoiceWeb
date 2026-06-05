import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate'; 

const TranslateCard = ({ title, language, translation }) => {
  return (
    <Card sx={{
      minWidth: 275,
      margin: '20px',
      border: '1px solid rgba(232, 160, 32, 0.15)',
      backgroundColor: 'transparent',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      borderRadius: '16px',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        boxShadow: '0 8px 24px rgba(232, 160, 32, 0.08)',
        transform: 'translateY(-2px)',
      }
    }}>
      <CardContent>
        <Box sx={{
          display: 'inline-block',
          borderRadius: '20px', 
          px: 2, 
          py: 1,  
        }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <TranslateIcon color="primary" /> {title} 
          </Typography>
        </Box>
        <Typography sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
          Language: {language}
        </Typography>
        <Typography sx={{ fontStyle: 'italic', color: 'text.primary' }}>
          {translation}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TranslateCard;

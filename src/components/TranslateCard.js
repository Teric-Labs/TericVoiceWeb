import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate'; // Icon for translation visual cue

const TranslateCard = ({ title, language, translation }) => {
  return (
    <Card sx={{
      minWidth: 275,
      margin: '20px',
      boxShadow: '0 4px 8px 0 rgba(0,0,0,0.5)',
      transition: '0.3s',
      backgroundColor: '#121212', 
      color: '#FFFFFF', 
      '&:hover': {
        boxShadow: '0 8px 16px 0 rgba(0,0,0,0.8)' 
      }
    }}>
      <CardContent>
        <Box sx={{
          display: 'inline-block',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px', 
          px: 2, 
          py: 1, 
          color: '#121212', 
        }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <TranslateIcon color="action" /> {title} 
          </Typography>
        </Box>
        <Typography sx={{ mt: 2, mb: 1 }}>
          Language: {language}
        </Typography>
        <Typography sx={{ fontStyle: 'italic' }}>
          {translation}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TranslateCard;

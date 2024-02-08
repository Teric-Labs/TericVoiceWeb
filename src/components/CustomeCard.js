import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const CustomCard = ({ heading, value, imageUrl, to }) => {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <Paper
        sx={{
          width: '90%',
          height: 350,
          maxWidth: '90%', 
          margin: 'auto',
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000', // Black background
          color: '#FFFFFF', // White text
          borderRadius: 16,
          '&:hover': {
            boxShadow: '0 8px 16px 0 rgba(255,255,255,0.2)',
            transform: 'scale(1.05)',
            transition: 'transform 0.3s ease-in-out'
          }
        }}
        elevation={3}
      >
        <img src={imageUrl} alt={heading} style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 20 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2, textAlign: 'center' }}>
          {heading}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.7, textAlign: 'center' }}>
          {value}
        </Typography>
      </Paper>
    </Link>
  );
};

export default CustomCard;

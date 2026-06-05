import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const CustomCard = ({ heading, value, imageUrl, to }) => {
  return (
    <Link to={to} style={{ textDecoration: 'none', width: '100%' }}>
      <Paper
        sx={{
          height: { xs: 250, sm: 300, md: 350 },
          maxWidth: { xs: '100%', sm: '80%', md: '75%' },
          margin: 'auto',
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 4,
          border: '1px solid rgba(232, 160, 32, 0.15)',
          backgroundColor: 'transparent',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(232, 160, 32, 0.08)',
            transform: 'translateY(-8px)'
          }
        }}
        elevation={0}
      >
        <Box
          component="img"
          src={imageUrl}
          alt={heading}
          sx={{
            width: 60,
            height: 60,
            objectFit: 'contain',
            marginBottom: 2
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            marginBottom: 2,
            textAlign: 'center',
            fontSize: '14px',
          }}
        >
          {heading}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            opacity: 0.8,
            fontSize: '12px',
          }}
        >
          {value}
        </Typography>
      </Paper>
    </Link>
  );
};

export default CustomCard;

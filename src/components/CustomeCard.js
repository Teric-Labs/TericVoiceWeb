import React from 'react';
import { Paper, Typography, Box} from '@mui/material';
import { Link } from 'react-router-dom';

const CustomCard = ({ heading, value, imageUrl,to }) => {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
    <Paper
      sx={{
        width: '90%',
        height:350,
        maxWidth:'90%', 
        margin: 'auto',
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#EBDFD7',
        borderRadius: 16
      }}
      elevation={3}
    >
      <img src={imageUrl} alt="log" style={{ width:60, marginBottom: 10 }} /> {/* Center the image and add some margin */}
      <Typography variant="body2" sx={{ fontSize: '1.2rem',fontWeight: 'bold', marginBottom: 2 }}>
        {heading}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '1rem', opacity: 0.5 }}>{value}</Typography>
    </Paper>
    </Link>
  );
};

export default CustomCard;

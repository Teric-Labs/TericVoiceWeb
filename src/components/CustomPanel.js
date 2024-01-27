import React from 'react';
import { Paper, Typography, Box} from '@mui/material';

const CustomPanel = ({ heading, value, imageUrl}) => {
  return (
    <Paper
      sx={{
        width: '80%',
        maxWidth:'100%', 
        margin: 'auto',
        padding:2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#EBDFD7',
      }}
      elevation={2}
    >
      <img src={imageUrl} alt="log" style={{ width:60, marginBottom: 10 }} /> 
      <Typography variant="body2" sx={{ fontSize: '1.2rem',fontWeight: 'bold', marginBottom: 2 }}>
        {heading}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '1rem', opacity: 0.5 }}>{value}</Typography>
    </Paper>
  );
};

export default CustomPanel;

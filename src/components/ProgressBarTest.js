import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ProfessionalProgressBar from './ProfessionalProgressBar';

const ProgressBarTest = () => {
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  const startTest = () => {
    setShowProgress(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowProgress(false), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Progress Bar Test
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={startTest}
        sx={{ mb: 3 }}
      >
        Test Progress Bar
      </Button>

      <ProfessionalProgressBar
        isVisible={showProgress}
        progress={progress}
        message="Testing Progress Bar..."
        subMessage={progress > 0 ? `${progress}% complete` : "Starting test..."}
        variant="determinate"
        type="translation"
        size="medium"
        showSpinner={true}
        showPercentage={true}
      />

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Test Different Types:
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <ProfessionalProgressBar
            isVisible={true}
            message="Translation Test"
            subMessage="AI processing..."
            type="translation"
            size="small"
          />
          
          <ProfessionalProgressBar
            isVisible={true}
            message="Upload Test"
            subMessage="Uploading file..."
            type="upload"
            size="medium"
          />
          
          <ProfessionalProgressBar
            isVisible={true}
            message="Processing Test"
            subMessage="Processing data..."
            type="processing"
            size="large"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressBarTest;

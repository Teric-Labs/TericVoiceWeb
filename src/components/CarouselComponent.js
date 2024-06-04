import React, { useState } from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import carouselData from '../constants/CarouselData';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const CarouselComponent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = carouselData.length;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Box sx={{ flexGrow: 1, margin: 'auto' }}>
      <AutoPlaySwipeableViews
        axis={'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {carouselData.map((step, index) => (
          <Box key={step.title} sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            {Math.abs(activeStep - index) <= 2 ? (
              <Box
                component="img"
                sx={{
                  height: matches ? 500 : 200, // Responsive height
                  maxWidth: '90%', // Limit max width to allow some space on the sides
                  overflow: 'hidden',
                  display: 'block', // This ensures the image is centered horizontally
                }}
                src={step.imgPath}
                alt={step.title}
              />
            ) : null}
            <Typography
              variant="h6"
              component="h1"
              sx={{
                mt: 5,
                textAlign: 'center',
                color: 'white',
                position: 'absolute',
                top: matches ? '85%' : '80%', // Adjust based on screen size
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
              }}
            >
              {step.title}
            </Typography>
            <Paper
              elevation={3}
              sx={{
                position: 'absolute',
                top: matches ? '90%' : '85%', // Adjust based on screen size
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: matches ? '90%' : '80%', // Responsive width
                bgcolor: 'background.paper',
                p: matches ? 2 : 1, // Adjust padding based on screen size
                fontSize: matches ? 'default' : 'small', // Adjust font size based on screen size
                textAlign: 'center',
                color: theme.palette.text.primary,
                border: 'none',
                fontFamily: 'Poppins'
              }}
            >
              {step.description}
            </Paper>
          </Box>
        ))}
      </AutoPlaySwipeableViews>
    </Box>
  );
};

export default CarouselComponent;

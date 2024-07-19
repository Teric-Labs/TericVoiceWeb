import React, { useState } from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery, MobileStepper } from '@mui/material';
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
    <Box sx={{ flexGrow: 1, margin: 'auto', position: 'relative' }}>
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
                  height: matches ? 500 : 200,
                  maxWidth: '90%',
                  overflow: 'hidden',
                  display: 'block',
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
                top: matches ? '85%' : '80%',
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
                top: matches ? '90%' : '85%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: matches ? '90%' : '80%',
                bgcolor: 'background.paper',
                p: matches ? 2 : 1,
                textAlign: 'center',
                color: theme.palette.text.primary,
                border: 'none',
                fontFamily: 'Poppins',
              }}
            >
              {step.description}
            </Paper>
          </Box>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={null}
        backButton={null}
        sx={{
          justifyContent: 'center',
          backgroundColor: 'transparent',
          mt: 2,
          '& .MuiMobileStepper-dot': {
            backgroundColor: 'white',
            '&.MuiMobileStepper-dotActive': {
              backgroundColor: '#1976d2',
            },
          },
        }}
      />
    </Box>
  );
};

export default CarouselComponent;

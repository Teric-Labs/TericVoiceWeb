import React, { useState} from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  useTheme, 
  IconButton,
  Fade
} from '@mui/material';
import { 
  KeyboardArrowLeft, 
  KeyboardArrowRight,
  RadioButtonUnchecked,
  Lens
} from '@mui/icons-material';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import carouselData from '../constants/CarouselData';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const CarouselComponent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const maxSteps = carouselData.length;
  const theme = useTheme();
  
  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep - 1 + maxSteps) % maxSteps);
  };

  const handleMouseEnter = () => {
    setAutoplay(false);
  };

  const handleMouseLeave = () => {
    setAutoplay(true);
  };

  return (
    <Box 
      sx={{ 
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        bgcolor: 'background.paper',
        height: { xs: '400px', sm: '600px' },
        '&:hover .MuiIconButton-root': {
          opacity: 1,
        },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
        autoplay={autoplay}
        interval={6000}
        springConfig={{ duration: '1s', easeFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', delay: '0s' }}
      >
        {carouselData.map((step, index) => (
          <div key={step.title}>
            {Math.abs(activeStep - index) <= 2 ? (
              <Box
                sx={{
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  component="img"
                  sx={{
                    height: '600px',
                    width: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                  src={step.imgPath}
                  alt={step.title}
                />
                
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    pt: 8,
                    pb: 4,
                    px: 3,
                  }}
                >
                  <Fade in timeout={1000}>
                    <Typography
                      variant="h4"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        textAlign: 'center',
                        mb: 2,
                        fontSize: { xs: '1.5rem', sm: '2rem' },
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                      }}
                    >
                      {step.title}
                    </Typography>
                  </Fade>
                  
                  <Fade in timeout={1500}>
                    <Paper
                      elevation={0}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        p: { xs: 2, sm: 3 },
                        mx: 'auto',
                        mb:4,
                        maxWidth: '600px',
                        borderRadius: '16px',
                        textAlign: 'center',
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.primary',
                          mb:2,
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          lineHeight: 1.6,
                        }}
                      >
                        {step.description}
                      </Typography>
                    </Paper>
                  </Fade>
                </Box>
              </Box>
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>

      {/* Navigation Arrows */}
      <IconButton
        onClick={handleBack}
        sx={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255,255,255,0.8)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
          opacity: 0,
          transition: 'opacity 0.3s ease',
          zIndex: 2,
        }}
      >
        <KeyboardArrowLeft />
      </IconButton>

      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255,255,255,0.8)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
          opacity: 0,
          transition: 'opacity 0.3s ease',
          zIndex: 2,
        }}
      >
        <KeyboardArrowRight />
      </IconButton>

      {/* Custom Stepper */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 1,
          zIndex: 2,
        }}
      >
        {carouselData.map((_, index) => (
          <IconButton
            key={index}
            onClick={() => handleStepChange(index)}
            sx={{
              p: 0.5,
              color: 'white',
              '&:hover': { bgcolor: 'transparent' },
            }}
          >
            {index === activeStep ? (
              <Lens sx={{ fontSize: 12 }} />
            ) : (
              <RadioButtonUnchecked sx={{ fontSize: 12 }} />
            )}
          </IconButton>
        ))}
      </Box>
    </Box>
  );
};

export default CarouselComponent;
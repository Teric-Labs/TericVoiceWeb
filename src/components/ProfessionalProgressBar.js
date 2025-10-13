import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  CircularProgress,
  Fade,
  Zoom
} from '@mui/material';

const ProfessionalProgressBar = ({ 
  isVisible = false, 
  progress = 0, 
  message = "Processing...", 
  subMessage = "Please wait",
  variant = "indeterminate", // "indeterminate" or "determinate"
  size = "medium", // "small", "medium", "large"
  type = "translation", // "translation", "upload", "processing"
  showSpinner = true,
  showPercentage = false
}) => {
  if (!isVisible) return null;

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          height: 4,
          spinnerSize: 12,
          fontSize: "caption"
        };
      case "large":
        return {
          height: 12,
          spinnerSize: 20,
          fontSize: "body1"
        };
      default: // medium
        return {
          height: 8,
          spinnerSize: 16,
          fontSize: "body2"
        };
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case "upload":
        return {
          gradient: "linear-gradient(90deg, #4caf50, #8bc34a, #4caf50)",
          backgroundColor: "rgba(76, 175, 80, 0.1)",
          animation: "uploadPulse 2s ease-in-out infinite"
        };
      case "processing":
        return {
          gradient: "linear-gradient(90deg, #ff9800, #ffc107, #ff9800)",
          backgroundColor: "rgba(255, 152, 0, 0.1)",
          animation: "processingPulse 1.8s ease-in-out infinite"
        };
      default: // translation
        return {
          gradient: "linear-gradient(90deg, #1976d2, #42a5f5, #1976d2)",
          backgroundColor: "rgba(25, 118, 210, 0.1)",
          animation: "translationPulse 2s ease-in-out infinite"
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const typeStyles = getTypeStyles();

  return (
    <Fade in={isVisible} timeout={300}>
      <Box sx={{ width: '100%' }}>
        {/* Header with message and percentage */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 1 
        }}>
          <Typography 
            variant={sizeStyles.fontSize} 
            color="primary" 
            sx={{ fontWeight: 500 }}
          >
            {message}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showPercentage && variant === "determinate" && (
              <Typography variant="caption" color="text.secondary">
                {Math.round(progress)}%
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              {subMessage}
            </Typography>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Zoom in={isVisible} timeout={500}>
          <LinearProgress
            variant={variant}
            value={variant === "determinate" ? progress : undefined}
            sx={{
              height: sizeStyles.height,
              borderRadius: sizeStyles.height / 2,
              backgroundColor: typeStyles.backgroundColor,
              '& .MuiLinearProgress-bar': {
                background: typeStyles.gradient,
                borderRadius: sizeStyles.height / 2,
                animation: typeStyles.animation,
              },
              '@keyframes translationPulse': {
                '0%': {
                  background: 'linear-gradient(90deg, #1976d2, #42a5f5, #1976d2)',
                },
                '50%': {
                  background: 'linear-gradient(90deg, #42a5f5, #1976d2, #42a5f5)',
                },
                '100%': {
                  background: 'linear-gradient(90deg, #1976d2, #42a5f5, #1976d2)',
                },
              },
              '@keyframes uploadPulse': {
                '0%': {
                  background: 'linear-gradient(90deg, #4caf50, #8bc34a, #4caf50)',
                },
                '50%': {
                  background: 'linear-gradient(90deg, #8bc34a, #4caf50, #8bc34a)',
                },
                '100%': {
                  background: 'linear-gradient(90deg, #4caf50, #8bc34a, #4caf50)',
                },
              },
              '@keyframes processingPulse': {
                '0%': {
                  background: 'linear-gradient(90deg, #ff9800, #ffc107, #ff9800)',
                },
                '50%': {
                  background: 'linear-gradient(90deg, #ffc107, #ff9800, #ffc107)',
                },
                '100%': {
                  background: 'linear-gradient(90deg, #ff9800, #ffc107, #ff9800)',
                },
              },
            }}
          />
        </Zoom>

        {/* Spinner and additional info */}
        {showSpinner && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mt: 2,
            gap: 1
          }}>
            <CircularProgress 
              size={sizeStyles.spinnerSize} 
              sx={{ 
                color: 'primary.main',
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }} 
            />
            <Typography variant="caption" color="text.secondary">
              {type === "translation" && "AI is analyzing your content..."}
              {type === "upload" && "Uploading your file..."}
              {type === "processing" && "Processing your request..."}
            </Typography>
          </Box>
        )}
      </Box>
    </Fade>
  );
};

export default ProfessionalProgressBar;

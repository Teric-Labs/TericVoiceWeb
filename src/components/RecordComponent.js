import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  IconButton, 
  Box, 
  Typography,
  Grid,
  LinearProgress,
  useTheme 
} from '@mui/material';
import { 
  Mic,
  MicNone,
  PlayArrow,
  Pause,
  Stop,
  GraphicEq,
  Timer
} from '@mui/icons-material';

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const RecordComponent = () => {
  const theme = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState('00:00');
  return (
    <Card 
      elevation={3}
      sx={{
        borderRadius: 2,
        bgcolor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <CardContent>
        <Grid container spacing={3}>
          {/* Recording Controls */}
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 2 
            }}>
              <IconButton 
                size="large"
                color={isRecording ? "error" : "primary"}
                sx={{ 
                  width: 64, 
                  height: 64,
                  transition: 'all 0.3s ease',
                  animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' },
                    '100%': { transform: 'scale(1)' }
                  }
                }}
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? <Mic fontSize="large" /> : <MicNone fontSize="large" />}
              </IconButton>
              
              <Typography variant="h6" color="text.secondary">
                {recordingTime}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  color="primary"
                  disabled={!isRecording}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
                <IconButton 
                  color="error"
                  disabled={!isRecording}
                >
                  <Stop />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Visualization */}
          <Grid item xs={12} md={8}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              height: '100%',
              gap: 2
            }}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 120,
                bgcolor: 'rgba(0,0,0,0.02)',
                borderRadius: 2,
                p: 2
              }}>
                {isRecording ? (
                  <GraphicEq 
                    sx={{ 
                      fontSize: 60,
                      color: theme.palette.primary.main,
                      animation: 'wave 1s infinite',
                      '@keyframes wave': {
                        '0%': { transform: 'scaleY(1)' },
                        '50%': { transform: 'scaleY(0.6)' },
                        '100%': { transform: 'scaleY(1)' }
                      }
                    }} 
                  />
                ) : (
                  <Timer sx={{ fontSize: 60, color: 'text.secondary' }} />
                )}
              </Box>
              
              {isRecording && (
                <LinearProgress 
                  variant="determinate" 
                  value={70}
                  sx={{ height: 4, borderRadius: 2 }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default RecordComponent;

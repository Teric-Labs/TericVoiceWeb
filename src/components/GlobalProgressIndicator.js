import React from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import ProfessionalProgressBar from './ProfessionalProgressBar';

const GlobalProgressIndicator = () => {
  const { global, transcription, translation, synthesis, summarization } = useSelector((state) => state.ui.loading);

  const isAnyLoading = global || transcription || translation || synthesis || summarization;
  
  // Determine the active tool for contextual loading messages
  let activeTool = 'global';
  if (transcription) activeTool = 'transcribe';
  if (translation) activeTool = 'translate';
  if (synthesis) activeTool = 'synthesize';
  if (summarization) activeTool = 'summarize';

  const getLoadingMessage = () => {
    switch(activeTool) {
      case 'transcribe': return 'Transcribing audio...';
      case 'translate': return 'Translating text...';
      case 'synthesize': return 'Synthesizing voice...';
      case 'summarize': return 'Generating summary...';
      default: return 'Processing...';
    }
  };

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999, // Above AppBar and Drawers
      pointerEvents: 'none', // Allow clicks to pass through
    }}>
      <ProfessionalProgressBar 
        isVisible={isAnyLoading}
        message={getLoadingMessage()}
        subMessage="Please wait"
        variant="indeterminate"
        size="small"
        showSpinner={false}
        showPercentage={false}
      />
    </Box>
  );
};

export default GlobalProgressIndicator;

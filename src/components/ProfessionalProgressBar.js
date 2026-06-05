import React from 'react';
import { Box } from '@mui/material';
import { AvoicesJobProgress, AvoicesProgress } from './progress';

/**
 * @deprecated Use AvoicesJobProgress or AvoicesProgress directly.
 * Kept for backward compatibility with GlobalProgressIndicator and tests.
 */
const ProfessionalProgressBar = ({
  isVisible = false,
  progress = 0,
  message = 'Processing…',
  subMessage = 'Please wait',
  variant = 'indeterminate',
  size = 'medium',
  showSpinner = false,
  showPercentage = true,
  sx,
}) => {
  if (!isVisible) return null;

  const progressSize = size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'md';

  if (variant === 'determinate') {
    return (
      <Box sx={{ width: '100%', ...sx }}>
        <AvoicesJobProgress
          value={progress}
          label={message}
          sublabel={showPercentage ? undefined : subMessage}
          size={progressSize}
        />
        {showSpinner && !showPercentage && (
          <Box sx={{ mt: 1 }}>
            <AvoicesProgress variant="indeterminate" size="xs" sublabel={subMessage} />
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <AvoicesProgress
        variant="indeterminate"
        size={progressSize}
        label={message}
        sublabel={subMessage}
      />
    </Box>
  );
};

export default ProfessionalProgressBar;

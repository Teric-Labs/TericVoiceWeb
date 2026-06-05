import React from 'react';
import { Box, LinearProgress, Typography, Fade } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { linearProgressSx, PROGRESS_AC } from './progressTokens';

const shimmer = keyframes`
  0% { opacity: 0.85; }
  50% { opacity: 1; }
  100% { opacity: 0.85; }
`;

/**
 * Fixed top-of-app progress — GitHub/Stripe-style global activity bar.
 */
export default function AvoicesGlobalBar({ visible, message = 'Processing…' }) {
  if (!visible) return null;

  return (
    <Fade in={visible} timeout={200}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        <LinearProgress
          variant="indeterminate"
          sx={{
            ...linearProgressSx({ size: 'xs', tone: 'brand' }),
            height: 3,
            animation: `${shimmer} 1.2s ease-in-out infinite`,
            boxShadow: `0 1px 12px ${PROGRESS_AC}55`,
          }}
        />
        {message && (
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              top: 6,
              right: 12,
              fontWeight: 800,
              fontSize: '0.65rem',
              color: PROGRESS_AC,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              bgcolor: 'rgba(255,255,255,0.92)',
              px: 1,
              py: 0.25,
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(17,17,17,0.08)',
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Fade>
  );
}

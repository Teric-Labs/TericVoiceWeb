import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { circularProgressSx } from './progressTokens';

/** Circular determinate ring (credits, quotas) with centered children */
export default function AvoicesRingProgress({
  value = 0,
  size = 120,
  thickness = 3,
  tone = 'brand',
  children,
  sx,
}) {
  const clamped = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', ...sx }}>
      <CircularProgress
        variant="determinate"
        value={clamped}
        size={size}
        thickness={thickness}
        sx={{
          ...circularProgressSx({ tone }),
          filter: tone === 'brand' ? 'drop-shadow(0 0 8px rgba(232,160,32,0.35))' : undefined,
        }}
      />
      {children && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
}

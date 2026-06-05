import React from 'react';
import { Box, CircularProgress, Typography, Stack } from '@mui/material';
import { circularProgressSx, SPINNER_SIZES } from './progressTokens';

/**
 * Unified circular loader — buttons, cards, inline states.
 */
export default function AvoicesSpinner({
  size = 'md',
  tone = 'brand',
  label,
  center = false,
  sx,
}) {
  const px = SPINNER_SIZES[size] || SPINNER_SIZES.md;

  const spinner = (
    <CircularProgress size={px} thickness={size === 'lg' || size === 'xl' ? 3 : 4} sx={circularProgressSx({ tone })} />
  );

  if (!label && !center) return <Box sx={sx}>{spinner}</Box>;

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1.5}
      sx={{ ...(center ? { py: 2 } : {}), ...sx }}
    >
      {spinner}
      {label && (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'rgba(17,17,17,0.55)', textAlign: 'center' }}>
          {label}
        </Typography>
      )}
    </Stack>
  );
}

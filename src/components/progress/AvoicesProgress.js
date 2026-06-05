import React from 'react';
import { Box, LinearProgress, Typography, Stack } from '@mui/material';
import { linearProgressSx, PROGRESS_AC } from './progressTokens';

/**
 * Unified linear progress bar.
 * @param {'indeterminate'|'determinate'} variant
 * @param {'xs'|'sm'|'md'|'lg'} size
 * @param {'brand'|'success'|'neutral'|'quota'} tone
 */
export default function AvoicesProgress({
  value = 0,
  variant = 'indeterminate',
  size = 'md',
  tone = 'brand',
  label,
  sublabel,
  showValue = false,
  sx,
  ...rest
}) {
  const clamped = Math.min(100, Math.max(0, Number(value) || 0));
  const hasHeader = label || sublabel || (showValue && variant === 'determinate');

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {hasHeader && (
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 0.75 }}>
          {label && (
            <Typography
              variant="caption"
              sx={{ fontWeight: 800, color: tone === 'quota' ? '#111' : PROGRESS_AC, letterSpacing: '0.02em' }}
            >
              {label}
            </Typography>
          )}
          <Stack direction="row" spacing={1} alignItems="center">
            {showValue && variant === 'determinate' && (
              <Typography
                variant="caption"
                component="span"
                sx={{
                  fontWeight: 800,
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: '0.72rem',
                  color: 'rgba(17,17,17,0.55)',
                }}
              >
                {Math.round(clamped)}%
              </Typography>
            )}
            {sublabel && (
              <Typography variant="caption" sx={{ color: 'rgba(17,17,17,0.4)', fontWeight: 600 }}>
                {sublabel}
              </Typography>
            )}
          </Stack>
        </Stack>
      )}
      <LinearProgress
        variant={variant}
        value={variant === 'determinate' ? clamped : undefined}
        sx={linearProgressSx({ size, tone })}
        {...rest}
      />
    </Box>
  );
}

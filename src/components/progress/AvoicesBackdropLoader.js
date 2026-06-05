import React from 'react';
import { Backdrop, Box, Typography, Stack } from '@mui/material';
import AvoicesSpinner from './AvoicesSpinner';
import AvoicesProgress from './AvoicesProgress';

/**
 * Studio fullscreen loading overlay.
 * Pass `progress` (1–100) for determinate bar; omit for honest indeterminate feedback.
 */
export default function AvoicesBackdropLoader({
  open,
  message = 'Processing…',
  submessage,
  progress,
  showBar = true,
}) {
  const hasDeterminateProgress = typeof progress === 'number' && progress > 0;

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: theme => theme.zIndex.drawer + 2,
        color: '#fff',
        flexDirection: 'column',
        gap: 2,
        left: 'var(--avoices-sidebar-width, 0px)',
        width: 'calc(100% - var(--avoices-sidebar-width, 0px))',
        bgcolor: 'rgba(17, 17, 17, 0.72)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <AvoicesSpinner size="lg" tone="brand" />
      <Stack spacing={0.5} alignItems="center" sx={{ px: 3, maxWidth: 360 }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#fff', textAlign: 'center' }}>
          {message}
        </Typography>
        {submessage && (
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', textAlign: 'center' }}>
            {submessage}
          </Typography>
        )}
      </Stack>
      {showBar && (
        <Box sx={{ width: 'min(320px, 80vw)', mt: 1 }}>
          <AvoicesProgress
            variant={hasDeterminateProgress ? 'determinate' : 'indeterminate'}
            value={hasDeterminateProgress ? Math.min(100, progress) : undefined}
            size="md"
            tone="brand"
            showValue={hasDeterminateProgress}
          />
        </Box>
      )}
    </Backdrop>
  );
}

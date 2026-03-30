import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In production, send to error tracking service here
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary:', error, info);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Box sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: 320, p: 4, textAlign: 'center',
      }}>
        <Box sx={{
          width: 56, height: 56, borderRadius: '50%', bgcolor: 'error.50',
          display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2,
        }}>
          <ErrorOutline sx={{ fontSize: 28, color: 'error.main' }} />
        </Box>
        <Typography variant="h6" fontWeight={600} mb={0.75}>
          Something went wrong
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3} maxWidth={340}>
          This section encountered an unexpected error. Try refreshing — your other work is not affected.
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained" startIcon={<Refresh />}
            onClick={() => this.setState({ hasError: false })}
            sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.location.reload()}
            sx={{ borderRadius: 1.5, textTransform: 'none' }}
          >
            Reload Page
          </Button>
        </Stack>
      </Box>
    );
  }
}

export default ErrorBoundary;

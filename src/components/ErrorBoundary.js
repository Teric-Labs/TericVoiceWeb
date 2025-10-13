import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Something went wrong
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {this.state.error && this.state.error.toString()}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

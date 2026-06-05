import React from 'react';
import { Box } from '@mui/material';

const ResultCodeBlock = ({ children, maxHeight = 400 }) => (
  <Box
    sx={{
      background: 'rgba(17, 17, 17, 0.04)',
      p: 2,
      borderRadius: '12px',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: '0.82rem',
      maxHeight,
      overflowY: 'auto',
      color: 'rgba(17, 17, 17, 0.65)',
      border: '1px solid rgba(17, 17, 17, 0.06)',
    }}
  >
    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{children}</pre>
  </Box>
);

export default ResultCodeBlock;

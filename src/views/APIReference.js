import React from 'react';
import { Box } from '@mui/material';
import ApiReferenceDocs from '../components/api-reference/ApiReferenceDocs';

/** Dashboard API reference — rendered inside Sidenav layout (no extra app bar). */
const APIReference = () => (
  <Box sx={{ width: '100%', minHeight: '100%' }}>
    <ApiReferenceDocs />
  </Box>
);

export default APIReference;

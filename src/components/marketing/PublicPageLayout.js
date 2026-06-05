import React from 'react';
import { Box } from '@mui/material';
import AppBarComponent from '../AppBarComponent';
import FooterComponent from '../FooterComponent';
import { M_PAGE_BG } from './marketingTokens';

/**
 * Standard shell for all top-nav public routes.
 */
export default function PublicPageLayout({ children, noPad = false }) {
  return (
    <Box
      className="public-page"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: M_PAGE_BG,
      }}
    >
      <AppBarComponent />
      <Box component="main" sx={{ flexGrow: 1, pt: noPad ? 0 : 0 }}>
        {children}
      </Box>
      <FooterComponent />
    </Box>
  );
}

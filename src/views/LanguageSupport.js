import React from 'react';
import { Box, Container, Typography, Stack, Chip } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import LanguageCatalog from '../components/languages/LanguageCatalog';
import { AC } from '../utils/mediaVault';
import { LANGUAGE_STATS } from '../constants/languageSupport';

/** Dashboard Languages page — inside Sidenav layout */
const LanguageSupport = () => (
  <Container maxWidth="xl" sx={{ pb: 6 }}>
    <Box sx={{ py: { xs: 2, md: 3 } }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <Box sx={{
          width: 48, height: 48, borderRadius: '12px',
          background: 'rgba(232,160,32,0.12)', border: `1px solid ${AC}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <LanguageIcon sx={{ fontSize: 26, color: AC }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.4rem', md: '1.75rem' }, letterSpacing: '-0.02em', color: '#111' }}>
            Languages
          </Typography>
          <Typography sx={{ color: 'rgba(17,17,17,0.5)', fontSize: '0.9rem', fontWeight: 600 }}>
            Coverage across {LANGUAGE_STATS.studioFeatures} studios · {LANGUAGE_STATS.totalLanguages} locales
          </Typography>
        </Box>
        <Chip
          label="Live catalog"
          size="small"
          sx={{ ml: 'auto', fontWeight: 700, bgcolor: 'rgba(16,185,129,0.1)', color: '#059669', display: { xs: 'none', sm: 'flex' } }}
        />
      </Stack>

      <LanguageCatalog variant="dashboard" />
    </Box>
  </Container>
);

export default LanguageSupport;

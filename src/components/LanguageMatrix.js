import React from 'react';
import { Box, Container } from '@mui/material';
import LanguageCatalog from './languages/LanguageCatalog';
import MarketingPageHeader from './marketing/MarketingPageHeader';
import { LANGUAGE_STATS } from '../constants/languageSupport';

export default function LanguageMatrix() {
  return (
    <Box>
      <MarketingPageHeader
        chip="Languages"
        title="Built for African languages."
        titleAccent="Ready for the world."
        subtitle={`${LANGUAGE_STATS.totalLanguages}+ languages across ${LANGUAGE_STATS.studioFeatures} production studios — with ${LANGUAGE_STATS.neuralVoices} neural voice locales.`}
        pt={{ xs: 8, md: 9 }}
        pb={2}
      />
      <Container maxWidth="lg" sx={{ pb: { xs: 4, md: 6 } }}>
        <LanguageCatalog variant="public" hidePublicHero />
      </Container>
    </Box>
  );
}

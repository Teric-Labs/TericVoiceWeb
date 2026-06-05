import React from 'react';
import { Box, Typography, Chip, Container } from '@mui/material';
import { mHeadline, mBody, mSectionLabel, M_AC, M_AC_DARK, M_BORDER } from './marketingTokens';

/**
 * Centered page hero for inner marketing routes (pricing, docs, languages).
 */
export default function MarketingPageHeader({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  chip,
  maxWidth = 640,
  pt = { xs: 8, md: 10 },
  pb = { xs: 2.5, md: 3.5 },
}) {
  return (
    <Box
      sx={{
        pt,
        pb,
        borderBottom: `1px solid ${M_BORDER}`,
        background: 'linear-gradient(180deg, rgba(248,246,240,0.6) 0%, transparent 100%)',
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        {chip && (
          <Chip
            label={chip}
            size="small"
            sx={{
              mb: 2.5,
              fontWeight: 700,
              fontSize: '0.72rem',
              bgcolor: 'rgba(232, 160, 32, 0.08)',
              color: M_AC,
              border: '1px solid rgba(232, 160, 32, 0.22)',
              borderRadius: '999px',
            }}
          />
        )}
        {eyebrow && (
          <Typography sx={{ ...mSectionLabel, mb: 1.5 }}>{eyebrow}</Typography>
        )}
        <Typography sx={{ ...mHeadline, fontSize: { xs: '2.25rem', md: '3.25rem' }, mb: 2 }}>
          {title}
          {titleAccent && (
            <>
              {' '}
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(135deg, ${M_AC}, ${M_AC_DARK})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {titleAccent}
              </Box>
            </>
          )}
        </Typography>
        {subtitle && (
          <Typography sx={{ ...mBody, maxWidth, mx: 'auto' }}>{subtitle}</Typography>
        )}
      </Container>
    </Box>
  );
}

import React from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails,
  Typography, Stack, Chip, IconButton, useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { RV_AC, rvAccordionSx } from './resultViewTokens';

const ResultLangAccordion = ({
  langCode,
  langLabel,
  meta,
  expanded,
  defaultExpanded = false,
  onChange,
  children,
  onCopy,
}) => {
  const isDark = useTheme().palette.mode === 'dark';
  const isExpanded = expanded ?? defaultExpanded;

  return (
    <Accordion
      {...(onChange != null
        ? { expanded, onChange }
        : { defaultExpanded })}
      sx={rvAccordionSx(isExpanded, isDark)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: RV_AC }} />} sx={{ borderRadius: '16px' }}>
        <Stack direction="row" alignItems="center" gap={2} sx={{ width: '100%', pr: 1 }}>
          <Chip
            label={(langCode || '').toUpperCase()}
            size="small"
            sx={{
              background: 'rgba(232, 160, 32, 0.1)',
              color: RV_AC,
              fontWeight: 800,
              fontSize: '0.68rem',
              height: 24,
            }}
          />
          <Typography sx={{ fontWeight: 700, color: '#111111', flex: 1 }}>
            {langLabel || langCode}
          </Typography>
          {meta && (
            <Typography variant="caption" sx={{ color: 'rgba(17, 17, 17, 0.35)', fontWeight: 600 }}>
              {meta}
            </Typography>
          )}
          {onCopy && (
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onCopy(); }}
              sx={{ color: 'rgba(17, 17, 17, 0.3)', '&:hover': { color: RV_AC } }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

export default ResultLangAccordion;

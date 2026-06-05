import React from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import {
  langLabel, truncateText, formatDurationMins, resolveRowTitle,
} from '../../utils/mediaVault';

export function StatusChip({ status }) {
  const s = (status || 'completed').toLowerCase();
  let color = 'success';
  let label = 'Completed';
  if (s === 'processing' || s === 'pending' || s === 'started') {
    color = 'warning';
    label = 'Processing';
  } else if (s === 'failed' || s === 'error') {
    color = 'error';
    label = 'Failed';
  } else if (s === 'partial') {
    color = 'warning';
    label = 'Partial';
  }
  return (
    <Chip
      label={label}
      size="small"
      color={color}
      sx={{ fontWeight: 700, fontSize: '0.7rem', height: 24 }}
    />
  );
}

export function TitleCell({ row, subtitle, titleOverride }) {
  const title = titleOverride || resolveRowTitle(row);
  return (
    <Box sx={{ minWidth: 0, maxWidth: 320 }}>
      <Typography variant="body2" sx={{ fontWeight: 700, color: '#111111', lineHeight: 1.3 }} noWrap>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: 'rgba(17,17,17,0.45)', display: 'block', mt: 0.25 }} noWrap>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

export function LangChip({ code }) {
  return (
    <Chip
      label={langLabel(code)}
      size="small"
      variant="outlined"
      sx={{ fontWeight: 600, fontSize: '0.72rem', height: 22 }}
    />
  );
}

export function MetaText({ children }) {
  return (
    <Typography variant="body2" sx={{ color: 'rgba(17,17,17,0.55)', fontSize: '0.8rem' }} noWrap>
      {children || '—'}
    </Typography>
  );
}

export function LangPair({ source, target }) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap>
      <LangChip code={source} />
      {target && (
        <>
          <Typography sx={{ color: 'rgba(17,17,17,0.35)', fontSize: '0.75rem' }}>→</Typography>
          <LangChip code={target} />
        </>
      )}
    </Stack>
  );
}

export { truncateText, formatDurationMins, langLabel, resolveRowTitle };

import React from 'react';
import { Box, Stack, Typography, IconButton, useTheme } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { RV_AC, rvGlass } from './resultViewTokens';

const ResultSection = ({
  title,
  icon: Icon,
  children,
  onCopy,
  highlight = false,
  sx = {},
}) => {
  const isDark = useTheme().palette.mode === 'dark';
  const glass = rvGlass(isDark);

  return (
    <Box
      sx={{
        ...glass,
        p: { xs: 2.5, md: 3.5 },
        mb: 3,
        ...(highlight && {
          border: '1px solid rgba(232, 160, 32, 0.25)',
          background: 'rgba(232, 160, 32, 0.04)',
        }),
        ...sx,
      }}
    >
      <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
        {Icon && <Icon sx={{ color: RV_AC, fontSize: 20 }} />}
        <Typography sx={{ fontWeight: 800, color: '#111111', fontSize: '0.95rem', flex: 1 }}>
          {title}
        </Typography>
        {onCopy && (
          <IconButton
            size="small"
            onClick={onCopy}
            aria-label="Copy"
            sx={{ color: 'rgba(17, 17, 17, 0.35)', '&:hover': { color: RV_AC, background: 'rgba(232, 160, 32, 0.08)' } }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>
      {children}
    </Box>
  );
};

export default ResultSection;

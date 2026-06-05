import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const tipTooltipSx = {
  bgcolor: '#111111',
  color: '#fff',
  fontSize: '0.74rem',
  fontWeight: 500,
  lineHeight: 1.55,
  p: 1.25,
  borderRadius: '10px',
  maxWidth: 240,
  boxShadow: '0 8px 24px rgba(0,0,0,0.28)',
  '& .MuiTooltip-arrow': { color: '#111111' },
};

/**
 * Small inline "?" help affordance with an on-brand tooltip.
 * Use beside labels/controls to explain non-obvious usage.
 */
export default function UsageTip({ title, placement = 'top', size = 15, sx }) {
  if (!title) return null;
  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow
      enterTouchDelay={0}
      leaveTouchDelay={4000}
      componentsProps={{ tooltip: { sx: tipTooltipSx } }}
    >
      <IconButton
        size="small"
        aria-label="More info"
        onClick={(e) => e.stopPropagation()}
        sx={{ color: 'rgba(17,17,17,0.3)', p: 0.25, '&:hover': { color: '#E8A020', background: 'rgba(232,160,32,0.08)' }, ...sx }}
      >
        <HelpOutlineIcon sx={{ fontSize: size }} />
      </IconButton>
    </Tooltip>
  );
}

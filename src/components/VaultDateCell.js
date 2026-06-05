import React from 'react';
import { Tooltip, Typography } from '@mui/material';
import { formatRelativeDate, formatFullDate } from '../utils/mediaVault';

export default function VaultDateCell({ row, dateKey = 'date' }) {
  const v = row[dateKey] || row.Date || row.date;
  return (
    <Tooltip title={formatFullDate(v)}>
      <Typography variant="body2" color="text.secondary">{formatRelativeDate(v)}</Typography>
    </Tooltip>
  );
}

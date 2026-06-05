import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import { estimateCredits } from '../utils/creditEstimate';

/**
 * Shows an estimated credit cost for a job before submission.
 * Turns red when the estimate exceeds the available balance.
 *
 * Props:
 *  - service: rate-card key (e.g. 'tts', 'voiceover_batch', 'video_dubbing')
 *  - quantity: units (chars, minutes, pages, or jobs)
 *  - balance: current credit balance (optional, enables low-balance styling)
 *  - min: minimum billable units floor (optional)
 */
export default function CreditEstimateChip({ service, quantity, balance = null, min = 0, sx }) {
  const cost = Math.max(estimateCredits(service, quantity), min ? estimateCredits(service, min) : 0);
  if (!cost || cost <= 0) return null;

  const insufficient = balance != null && Number(balance) < cost;

  return (
    <Tooltip title={insufficient ? 'Estimated cost exceeds your balance' : 'Estimated credits for this job (final cost may vary)'}>
      <Chip
        size="small"
        icon={<BoltIcon sx={{ fontSize: '0.95rem !important' }} />}
        label={`~${cost.toFixed(2)} credits`}
        sx={{
          fontWeight: 800,
          fontSize: '0.72rem',
          bgcolor: insufficient ? 'rgba(239,68,68,0.12)' : 'rgba(232,160,32,0.12)',
          color: insufficient ? '#ef4444' : '#C47F10',
          border: `1px solid ${insufficient ? 'rgba(239,68,68,0.3)' : 'rgba(232,160,32,0.3)'}`,
          '& .MuiChip-icon': { color: 'inherit' },
          ...sx,
        }}
      />
    </Tooltip>
  );
}

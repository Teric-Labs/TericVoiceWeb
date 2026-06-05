import React from 'react';
import AvoicesProgress from './AvoicesProgress';

/** Inline indeterminate strip for form/page loading (category: INLINE). */
export default function ActivityStrip({ active, sx, label }) {
  if (!active) return null;
  return (
    <AvoicesProgress
      variant="indeterminate"
      size="sm"
      label={label}
      sx={{ mb: 2.5, ...sx }}
    />
  );
}

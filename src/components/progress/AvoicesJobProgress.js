import React from 'react';
import AvoicesProgress from './AvoicesProgress';

/** Determinate job progress with label + percentage (translation, uploads, etc.) */
export default function AvoicesJobProgress({
  value = 0,
  label = 'Processing…',
  sublabel,
  size = 'sm',
  tone = 'brand',
  sx,
}) {
  return (
    <AvoicesProgress
      variant="determinate"
      value={value}
      size={size}
      tone={tone}
      label={label}
      sublabel={sublabel}
      showValue
      sx={sx}
    />
  );
}

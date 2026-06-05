/** Avoices progress design system — single source for all indicators */

export const PROGRESS_AC = '#E8A020';
export const PROGRESS_GRADIENT = 'linear-gradient(90deg, #E8A020 0%, #F5B844 45%, #C47F10 100%)';
export const PROGRESS_TRACK = 'rgba(17, 17, 17, 0.08)';

export const PROGRESS_SIZES = {
  xs: { height: 3, radius: 3 },
  sm: { height: 4, radius: 4 },
  md: { height: 6, radius: 6 },
  lg: { height: 8, radius: 8 },
};

export const SPINNER_SIZES = {
  xs: 16,
  sm: 20,
  md: 32,
  lg: 48,
  xl: 56,
};

/** Category guide (for docs / devs)
 * GLOBAL_TOP     — fixed app-wide activity (Redux ui.loading)
 * INLINE         — form submit strip under toolbars
 * JOB            — determinate task with % (translation SSE, uploads)
 * METRIC         — quotas, coverage, analytics breakdown
 * OVERLAY        — studio fullscreen backdrop
 * RING           — circular credit / balance meters
 * STEPPER        — workflow steps (see STEPPER_SX in mediaVault)
 * SKELETON       — table/card placeholders
 * MEDIA          — audio player scrubber (rhap) — do not replace
 */

export function linearProgressSx({ size = 'md', tone = 'brand' } = {}) {
  const s = PROGRESS_SIZES[size] || PROGRESS_SIZES.md;
  const barBg = tone === 'success'
    ? 'linear-gradient(90deg, #10b981, #34d399)'
    : tone === 'quota'
      ? 'linear-gradient(90deg, #111111, #333333)'
      : PROGRESS_GRADIENT;

  return {
    height: s.height,
    borderRadius: s.radius,
    bgcolor: PROGRESS_TRACK,
    overflow: 'hidden',
    '& .MuiLinearProgress-bar': {
      borderRadius: s.radius,
      background: barBg,
    },
    ...(tone === 'brand' && {
      '& .MuiLinearProgress-bar1Indeterminate': {
        background: PROGRESS_GRADIENT,
      },
      '& .MuiLinearProgress-bar2Indeterminate': {
        background: PROGRESS_GRADIENT,
        opacity: 0.4,
      },
    }),
  };
}

export function circularProgressSx({ tone = 'brand' } = {}) {
  return {
    color: tone === 'success' ? '#10b981' : PROGRESS_AC,
    '& .MuiCircularProgress-circle': {
      strokeLinecap: 'round',
    },
  };
}

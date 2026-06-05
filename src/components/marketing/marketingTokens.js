/** Brand tokens for public marketing pages — do not change palette values */
export const M_AC = '#E8A020';
export const M_AC_LIGHT = '#F5B844';
export const M_AC_DARK = '#C47F10';
export const M_BLACK = '#111111';
export const M_OFFWHITE = '#F8F6F0';
export const M_PAGE_BG = '#FAFAF8';
export const M_SURFACE = '#FFFFFF';
export const M_BORDER = 'rgba(17, 17, 17, 0.08)';
export const M_BORDER_STRONG = 'rgba(17, 17, 17, 0.12)';
export const M_TEXT_MUTED = 'rgba(17, 17, 17, 0.55)';
export const M_TEXT_SUBTLE = 'rgba(17, 17, 17, 0.4)';

export const M_GRADIENT = `linear-gradient(135deg, ${M_AC} 0%, ${M_AC_LIGHT} 50%, ${M_AC_DARK} 100%)`;

export const mBtnPrimary = {
  background: M_GRADIENT,
  color: M_BLACK,
  fontWeight: 700,
  textTransform: 'none',
  borderRadius: '999px',
  boxShadow: '0 4px 20px rgba(232, 160, 32, 0.28)',
  '&:hover': {
    boxShadow: '0 8px 28px rgba(232, 160, 32, 0.38)',
    transform: 'translateY(-1px)',
  },
};

export const mBtnSecondary = {
  color: M_BLACK,
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '999px',
  border: `1px solid ${M_BORDER_STRONG}`,
  background: M_SURFACE,
  '&:hover': {
    borderColor: 'rgba(232, 160, 32, 0.35)',
    background: 'rgba(232, 160, 32, 0.04)',
  },
};

export const mCard = {
  background: M_SURFACE,
  border: `1px solid ${M_BORDER}`,
  borderRadius: '16px',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    borderColor: 'rgba(232, 160, 32, 0.22)',
    boxShadow: '0 8px 32px rgba(17, 17, 17, 0.06)',
  },
};

export const mSectionLabel = {
  color: M_AC,
  fontWeight: 700,
  fontSize: '0.72rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
};

export const mHeadline = {
  color: M_BLACK,
  fontWeight: 800,
  letterSpacing: '-0.035em',
  lineHeight: 1.08,
};

export const mBody = {
  color: M_TEXT_MUTED,
  lineHeight: 1.7,
  fontSize: { xs: '1rem', md: '1.0625rem' },
};

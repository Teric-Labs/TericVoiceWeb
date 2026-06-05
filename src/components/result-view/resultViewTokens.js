/** Shared tokens for Media Vault result detail pages */
export const RV_AC = '#E8A020';
export const RV_G = 'linear-gradient(135deg, #E8A020 0%, #F5B844 50%, #C47F10 100%)';

export const rvGlass = (isDark = false) => ({
  background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(17, 17, 17, 0.025)',
  backdropFilter: 'blur(16px)',
  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(17, 17, 17, 0.07)',
  borderRadius: '20px',
});

export const rvAccordionSx = (expanded = false, isDark = false) => ({
  mb: 2,
  borderRadius: '16px !important',
  '&:before': { display: 'none' },
  background: expanded
    ? 'rgba(232, 160, 32, 0.05)'
    : isDark ? 'rgba(255, 255, 255, 0.015)' : 'rgba(17, 17, 17, 0.02)',
  border: expanded
    ? '1px solid rgba(232, 160, 32, 0.28)'
    : isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(17, 17, 17, 0.07)',
  boxShadow: 'none',
  transition: 'border-color 0.2s, background 0.2s',
});

export const rvLangChipSx = (active) => ({
  fontWeight: 700,
  cursor: 'pointer',
  ...(active
    ? { background: 'rgba(232, 160, 32, 0.12)', color: RV_AC, border: '1px solid rgba(232, 160, 32, 0.35)' }
    : { background: 'rgba(17, 17, 17, 0.04)', color: 'rgba(17, 17, 17, 0.55)', border: '1px solid rgba(17, 17, 17, 0.08)' }),
});

export const rvBackButtonSx = {
  mb: 3,
  color: 'rgba(17, 17, 17, 0.55)',
  textTransform: 'none',
  fontWeight: 700,
  borderRadius: '50px',
  px: 2,
  '&:hover': { color: RV_AC, background: 'rgba(232, 160, 32, 0.08)' },
};

export const rvPrimaryButtonSx = {
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 800,
  background: RV_G,
  color: '#111111',
  px: 3,
  boxShadow: '0 4px 14px rgba(232, 160, 32, 0.25)',
  '&:hover': { opacity: 0.92, boxShadow: '0 6px 20px rgba(232, 160, 32, 0.35)' },
};

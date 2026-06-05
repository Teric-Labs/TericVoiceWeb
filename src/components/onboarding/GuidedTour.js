import React, { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { Box, Popper, Paper, Typography, Button, Stack, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const AC = '#E8A020';
const G = 'linear-gradient(135deg, #E8A020, #C47F10)';
const Z = 13000;

/**
 * Lightweight guided product tour: a spotlight overlay + a Popper-anchored
 * coach mark that steps through elements located by CSS selector.
 *
 * Each step: { selector?, title, body, placement?, padding?, radius? }
 * A step with no selector (or a missing target) renders a centered card.
 */
export default function GuidedTour({ steps = [], open, stepIndex = 0, onNext, onBack, onClose }) {
  const [rect, setRect] = useState(null);
  const [anchor, setAnchor] = useState(null);
  const step = steps[stepIndex];

  const measure = useCallback(() => {
    if (!step || !step.selector) { setRect(null); setAnchor(null); return; }
    const el = document.querySelector(step.selector);
    if (!el) { setRect(null); setAnchor(null); return; }
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) { setRect(null); setAnchor(null); return; }
    setAnchor(el);
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [step]);

  useLayoutEffect(() => {
    if (!open || !step) return undefined;
    const el = step.selector ? document.querySelector(step.selector) : null;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    measure();
    const t = setTimeout(measure, 320); // re-measure after scroll settles
    return () => clearTimeout(t);
  }, [open, step, stepIndex, measure]);

  useEffect(() => {
    if (!open) return undefined;
    const onChange = () => measure();
    window.addEventListener('resize', onChange);
    window.addEventListener('scroll', onChange, true);
    return () => {
      window.removeEventListener('resize', onChange);
      window.removeEventListener('scroll', onChange, true);
    };
  }, [open, measure]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      else if (e.key === 'ArrowRight' || e.key === 'Enter') onNext?.();
      else if (e.key === 'ArrowLeft') onBack?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onNext, onBack, onClose]);

  if (!open || !step) return null;

  const pad = step.padding ?? 8;
  const isLast = stepIndex === steps.length - 1;
  const isFirst = stepIndex === 0;

  const card = (
    <Paper
      elevation={0}
      sx={{
        width: 340, maxWidth: '90vw', borderRadius: '18px', p: 2.5,
        boxShadow: '0 20px 60px rgba(10,10,12,0.35)',
        border: `1px solid ${AC}33`,
        background: '#fff',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
        <Typography sx={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: AC }}>
          {step.eyebrow || 'Quick tour'} · {stepIndex + 1}/{steps.length}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ p: 0.25, mt: -0.5, mr: -0.5, color: 'rgba(17,17,17,0.35)', '&:hover': { color: '#111' } }}>
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Stack>

      <Typography sx={{ fontWeight: 900, fontSize: '1.02rem', color: '#111111', mb: 0.75, letterSpacing: '-0.01em' }}>
        {step.title}
      </Typography>
      <Typography sx={{ fontSize: '0.84rem', color: 'rgba(17,17,17,0.62)', lineHeight: 1.6 }}>
        {step.body}
      </Typography>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2.25 }}>
        <Stack direction="row" spacing={0.5}>
          {steps.map((_, i) => (
            <Box key={i} sx={{ width: i === stepIndex ? 18 : 6, height: 6, borderRadius: 3, background: i === stepIndex ? G : 'rgba(17,17,17,0.14)', transition: 'all 0.2s' }} />
          ))}
        </Stack>
        <Stack direction="row" spacing={1}>
          {!isFirst && (
            <Button onClick={onBack} size="small" startIcon={<ArrowBackIcon sx={{ fontSize: 15 }} />} sx={{ textTransform: 'none', fontWeight: 700, color: 'rgba(17,17,17,0.55)', minWidth: 0 }}>
              Back
            </Button>
          )}
          <Button
            onClick={onNext}
            size="small"
            variant="contained"
            endIcon={!isLast ? <ArrowForwardIcon sx={{ fontSize: 15 }} /> : undefined}
            sx={{ textTransform: 'none', fontWeight: 800, background: G, color: '#111', borderRadius: '10px', px: 2, boxShadow: 'none', '&:hover': { opacity: 0.92, boxShadow: 'none' } }}
          >
            {isLast ? 'Got it' : 'Next'}
          </Button>
        </Stack>
      </Stack>

      {isFirst && (
        <Button onClick={onClose} size="small" fullWidth sx={{ mt: 1, textTransform: 'none', fontWeight: 600, fontSize: '0.72rem', color: 'rgba(17,17,17,0.4)' }}>
          Skip tour
        </Button>
      )}
    </Paper>
  );

  return (
    <>
      {/* Click blocker — captures clicks so the app behind isn't interactable */}
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{ position: 'fixed', inset: 0, zIndex: Z - 1, background: rect ? 'transparent' : 'rgba(10,10,12,0.6)', cursor: 'default' }}
      />

      {/* Spotlight cutout via huge box-shadow */}
      {rect && (
        <Box
          sx={{
            position: 'fixed',
            top: rect.top - pad,
            left: rect.left - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
            borderRadius: `${step.radius ?? 14}px`,
            boxShadow: '0 0 0 9999px rgba(10,10,12,0.6)',
            border: `2px solid ${AC}`,
            zIndex: Z,
            pointerEvents: 'none',
            transition: 'top 0.25s ease, left 0.25s ease, width 0.25s ease, height 0.25s ease',
          }}
        />
      )}

      {rect ? (
        <Popper
          open
          anchorEl={anchor}
          placement={step.placement || 'bottom'}
          style={{ zIndex: Z + 1 }}
          modifiers={[
            { name: 'offset', options: { offset: [0, 16] } },
            { name: 'preventOverflow', options: { padding: 12 } },
            { name: 'flip', options: { padding: 12 } },
          ]}
        >
          {card}
        </Popper>
      ) : (
        <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: Z + 1 }}>
          {card}
        </Box>
      )}
    </>
  );
}

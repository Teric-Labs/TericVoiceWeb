import React, { useState } from 'react';
import {
  Box, Typography, Grid, Container, Button, Chip, Switch,
  Accordion, AccordionSummary, AccordionDetails, Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { keyframes } from '@mui/material/styles';
import {
  CheckCircle, Close, ExpandMore, ArrowForward,
  Diamond, Workspaces, WorkspacePremium, Lock,
  VerifiedUser, Bolt, ShieldOutlined,
} from '@mui/icons-material';
import { PLANS, PLAN_COLORS } from '../constants/plans';

// ── Animations ─────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const pulseGlow = keyframes`
  0%,100% { opacity: 0.5; transform: scale(1); }
  50%      { opacity: 0.9; transform: scale(1.05); }
`;

const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
const GOLD = '#f59e0b';

const PLAN_ICONS = {
  'Free Trial':      <Lock sx={{ fontSize: 22 }} />,
  'Classic':         <WorkspacePremium sx={{ fontSize: 22 }} />,
  'Classic Pro':     <Diamond sx={{ fontSize: 22 }} />,
  'Enterprise Plus': <Workspaces sx={{ fontSize: 22 }} />,
};

// ── Kente background ────────────────────────────────────────────────────────
function KenteBg() {
  return (
    <Box component="svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"
      sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none' }}
    >
      <defs>
        <pattern id="kente-price" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
          <line x1="0" y1="20" x2="40" y2="20" stroke="#8b5cf6" strokeWidth="0.4" />
          <line x1="20" y1="0" x2="20" y2="40" stroke="#8b5cf6" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kente-price)" />
    </Box>
  );
}

// ── Pricing card ─────────────────────────────────────────────────────────────
function PricingCard({ plan, isAnnual, index }) {
  const color = PLAN_COLORS[plan.title] || '#0ea5e9';
  const isCustom = plan.monthly === 'Custom';
  const isFree = plan.monthlyRaw === 0;
  const price = isAnnual ? plan.annual : plan.monthly;

  const handleClick = () => {
    if (plan.ctaPath?.startsWith('mailto:')) {
      window.open(plan.ctaPath, '_blank');
    } else if (plan.ctaPath) {
      window.location.href = plan.ctaPath;
    }
  };

  return (
    <Box sx={{
      position: 'relative',
      background: plan.popular
        ? `linear-gradient(160deg, rgba(14,165,233,0.07), rgba(139,92,246,0.07))`
        : 'rgba(255,255,255,0.025)',
      border: plan.popular
        ? '1.5px solid rgba(14,165,233,0.4)'
        : '1px solid rgba(255,255,255,0.07)',
      borderRadius: '24px',
      p: { xs: 3, md: 3.5 },
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      animation: `${fadeUp} 0.55s ease ${index * 0.09}s both`,
      boxShadow: plan.popular ? `0 0 0 1px ${color}25, 0 24px 64px ${color}18` : 'none',
      '&:hover': {
        transform: 'translateY(-6px)',
        borderColor: `${color}50`,
        boxShadow: `0 0 0 1px ${color}30, 0 32px 72px ${color}20`,
      },
    }}>
      {/* Popular badge */}
      {plan.popular && (
        <Box sx={{
          position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
          background: G, borderRadius: '50px', px: 2, py: 0.5,
          boxShadow: `0 4px 16px ${color}50`,
        }}>
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            ⚡ Most Popular
          </Typography>
        </Box>
      )}

      {/* Header */}
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: '14px',
            background: `${color}15`, border: `1px solid ${color}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color,
          }}>
            {PLAN_ICONS[plan.title] || <Diamond sx={{ fontSize: 22 }} />}
          </Box>
          {/* Annual savings */}
          {isAnnual && plan.monthlyRaw > 0 && plan.annualRaw && (
            <Chip
              label={`Save ${Math.round((1 - plan.annualRaw / plan.monthlyRaw) * 100)}%`}
              size="small"
              sx={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', fontWeight: 700, fontSize: '0.7rem', borderRadius: '50px' }}
            />
          )}
        </Box>

        <Typography sx={{ color, fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.75 }}>
          {plan.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.75, mb: 1 }}>
          {isCustom ? (
            <Typography sx={{ color: GOLD, fontWeight: 800, fontSize: '2rem', lineHeight: 1 }}>Custom</Typography>
          ) : (
            <>
              <Typography sx={{ color: '#f8fafc', fontWeight: 900, fontSize: '3rem', lineHeight: 1, letterSpacing: '-0.04em' }}>{price}</Typography>
              {!isFree && <Typography sx={{ color: '#475569', fontSize: '0.9rem', mb: 0.5 }}>/mo</Typography>}
            </>
          )}
        </Box>

        <Typography sx={{ color: '#64748b', fontSize: '0.87rem', lineHeight: 1.6 }}>
          {plan.description}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 2.5 }} />

      {/* Features */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3.5 }}>
        {plan.features.map(({ label, included }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ flexShrink: 0 }}>
              {included
                ? <CheckCircle sx={{ fontSize: 16, color }} />
                : <Close sx={{ fontSize: 16, color: '#374151' }} />
              }
            </Box>
            <Typography sx={{ color: included ? '#cbd5e1' : '#374151', fontSize: '0.88rem', fontWeight: included ? 500 : 400 }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* CTA */}
      <Button
        fullWidth
        onClick={handleClick}
        component={!plan.ctaPath?.startsWith('mailto:') && plan.ctaPath ? Link : 'button'}
        to={!plan.ctaPath?.startsWith('mailto:') ? plan.ctaPath : undefined}
        variant={plan.popular ? 'contained' : 'outlined'}
        endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
        sx={{
          py: 1.5, borderRadius: '50px', fontWeight: 700, fontSize: '0.93rem', textTransform: 'none',
          ...(plan.popular ? {
            background: G, color: '#fff',
            boxShadow: `0 6px 24px ${color}40`,
            '&:hover': { transform: 'translateY(-1px)', boxShadow: `0 8px 32px ${color}55` },
          } : isCustom ? {
            background: `${GOLD}12`, color: GOLD, border: `1.5px solid ${GOLD}40`,
            '&:hover': { background: `${GOLD}22`, borderColor: GOLD },
          } : {
            background: `${color}10`, color, border: `1.5px solid ${color}35`,
            '&:hover': { background: `${color}20`, borderColor: color },
          }),
        }}
      >
        {plan.cta}
      </Button>
    </Box>
  );
}

// ── FAQ data ─────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'Can I switch plans at any time?',
    a: 'Yes — upgrade, downgrade, or cancel anytime. Changes take effect at the start of your next billing cycle.',
  },
  {
    q: 'What languages are supported on the Free Trial?',
    a: 'All plans, including Free Trial, give access to the full library of 50+ languages including Luganda, Swahili, Amharic, Yoruba, English, French and more.',
  },
  {
    q: "What's included in Classic Pro's API access?",
    a: 'Classic Pro includes full REST API access with standard rate limits, allowing you to integrate transcription, translation, TTS and summarization into your own apps.',
  },
  {
    q: 'How does Enterprise Plus pricing work?',
    a: 'Enterprise Plus is custom-quoted based on volume, infrastructure needs, and SLA requirements. Contact our sales team and we\'ll tailor a package for your organisation.',
  },
];

// ── Main export ───────────────────────────────────────────────────────────────
export default function PricingComponent() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <Box sx={{ background: '#07071a', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <KenteBg />

      {/* Ambient glow */}
      <Box sx={{
        position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)',
        width: 700, height: 400, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)',
        animation: `${pulseGlow} 8s ease-in-out infinite`, pointerEvents: 'none',
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: { xs: 10, md: 14 } }}>

        {/* ── Header ──────────────────────────────────── */}
        <Box sx={{ textAlign: 'center', mb: 8, animation: `${fadeUp} 0.5s ease both` }}>
          <Chip label="Simple, Transparent Pricing" size="small" sx={{
            background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
            color: GOLD, fontWeight: 700, borderRadius: '50px', mb: 3,
            '& .MuiChip-label': { px: 2 },
          }} />
          <Typography sx={{
            color: '#f8fafc', fontWeight: 800,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            letterSpacing: '-0.03em', lineHeight: 1.1, mb: 2,
          }}>
            Start free.{' '}
            <Box component="span" sx={{ background: G, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Scale effortlessly.
            </Box>
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: { xs: '1rem', md: '1.15rem' }, mb: 5, maxWidth: 500, mx: 'auto', lineHeight: 1.7 }}>
            No surprise fees. No lock-in. Upgrade or cancel anytime.
          </Typography>

          {/* Billing toggle */}
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '50px', px: 2.5, py: 1 }}>
            <Typography sx={{ color: !isAnnual ? '#f8fafc' : '#475569', fontWeight: 700, fontSize: '0.9rem' }}>Monthly</Typography>
            <Switch
              checked={isAnnual}
              onChange={e => setIsAnnual(e.target.checked)}
              sx={{
                '& .MuiSwitch-track': { background: G, opacity: 1 },
                '& .MuiSwitch-thumb': { background: '#fff' },
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: isAnnual ? '#f8fafc' : '#475569', fontWeight: 700, fontSize: '0.9rem' }}>Annual</Typography>
              <Chip label="Save 20%" size="small" sx={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', fontWeight: 700, fontSize: '0.7rem', borderRadius: '50px' }} />
            </Box>
          </Box>
        </Box>

        {/* ── Plan cards ──────────────────────────────── */}
        <Grid container spacing={3} justifyContent="center" alignItems="stretch" sx={{ mb: 8 }}>
          {PLANS.map((plan, i) => (
            <Grid item xs={12} sm={6} md={3} key={plan.id}>
              <PricingCard plan={plan} isAnnual={isAnnual} index={i} />
            </Grid>
          ))}
        </Grid>

        {/* ── Trust strip ─────────────────────────────── */}
        <Box sx={{
          display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
          gap: { xs: 3, md: 6 }, mb: 8,
          py: 3.5, borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)',
          animation: `${fadeUp} 0.5s ease 0.4s both`,
        }}>
          {[
            { icon: <ShieldOutlined sx={{ fontSize: 18, color: '#10b981' }} />, text: 'Secure Stripe payments' },
            { icon: <VerifiedUser sx={{ fontSize: 18, color: '#0ea5e9' }} />, text: 'SOC 2 compliant' },
            { icon: <Bolt sx={{ fontSize: 18, color: '#8b5cf6' }} />, text: 'Instant activation' },
            { icon: <Lock sx={{ fontSize: 18, color: GOLD }} />, text: 'Cancel anytime' },
          ].map(({ icon, text }) => (
            <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              {icon}
              <Typography sx={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 600 }}>{text}</Typography>
            </Box>
          ))}
        </Box>

        {/* ── Enterprise callout ───────────────────────── */}
        <Box sx={{
          mb: 8, p: { xs: 4, md: 5 },
          background: 'rgba(245,158,11,0.04)',
          border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3,
          animation: `${fadeUp} 0.5s ease 0.45s both`,
        }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
              <Workspaces sx={{ color: GOLD, fontSize: 20 }} />
              <Typography sx={{ color: GOLD, fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Enterprise Plus</Typography>
            </Box>
            <Typography sx={{ color: '#f8fafc', fontWeight: 700, fontSize: { xs: '1.2rem', md: '1.4rem' }, mb: 0.5 }}>
              Need unlimited scale for your team?
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.92rem' }}>
              Custom models, dedicated infrastructure, SLA guarantees and 24/7 support.
            </Typography>
          </Box>
          <Button
            onClick={() => window.open('mailto:labteric@gmail.com?subject=Enterprise%20Plus%20Inquiry', '_blank')}
            variant="outlined"
            endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
            sx={{
              borderColor: `${GOLD}40`, color: GOLD, fontWeight: 700, px: 3.5, py: 1.4,
              borderRadius: '50px', whiteSpace: 'nowrap', textTransform: 'none',
              '&:hover': { borderColor: GOLD, background: `${GOLD}10` },
            }}
          >
            Talk to Sales
          </Button>
        </Box>

        {/* ── FAQ ─────────────────────────────────────── */}
        <Box sx={{ maxWidth: 680, mx: 'auto', animation: `${fadeUp} 0.5s ease 0.5s both` }}>
          <Typography sx={{ color: '#f8fafc', fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.025em', textAlign: 'center', mb: 4 }}>
            Frequently asked questions
          </Typography>
          {FAQS.map(({ q, a }) => (
            <Accordion key={q} elevation={0} sx={{
              background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px !important', mb: 1.5, overflow: 'hidden',
              '&:before': { display: 'none' },
              '&.Mui-expanded': { border: '1px solid rgba(14,165,233,0.2)', background: 'rgba(14,165,233,0.04)' },
            }}>
              <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#64748b' }} />} sx={{ px: 3, py: 0.5 }}>
                <Typography sx={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.97rem' }}>{q}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 2.5 }}>
                <Typography sx={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.75 }}>{a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

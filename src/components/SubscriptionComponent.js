import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Button, Modal, Container,
  Chip, CircularProgress, Divider,
} from '@mui/material';
import {
  CheckCircle, Close, ArrowForward, Diamond, Workspaces,
  WorkspacePremium, Lock, VerifiedUser, Bolt,
} from '@mui/icons-material';
import { keyframes } from '@mui/material/styles';
import { subscriptionAPI } from '../services/api';
import StripeCheckoutForm from './StripeCheckoutForm';
import { PLANS, PLAN_COLORS } from '../constants/plans';

// ── Animations ─────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const pulseGlow = keyframes`
  0%,100% { opacity: 0.6; transform: scale(1); }
  50%      { opacity: 1;   transform: scale(1.04); }
`;

const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
const GOLD = '#f59e0b';

const PLAN_ICONS = {
  'Free Trial':      <Lock sx={{ fontSize: 22 }} />,
  'Classic':         <WorkspacePremium sx={{ fontSize: 22 }} />,
  'Classic Pro':     <Diamond sx={{ fontSize: 22 }} />,
  'Enterprise Plus': <Workspaces sx={{ fontSize: 22 }} />,
};

// ── Kente SVG ─────────────────────────────────────────────────────────────
function KenteBg() {
  return (
    <Box component="svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"
      sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03, pointerEvents: 'none' }}
    >
      <defs>
        <pattern id="kente-sub" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
          <line x1="0" y1="20" x2="40" y2="20" stroke="#8b5cf6" strokeWidth="0.4" />
          <line x1="20" y1="0" x2="20" y2="40" stroke="#8b5cf6" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kente-sub)" />
    </Box>
  );
}

// ── Plan card ─────────────────────────────────────────────────────────────
function PlanCard({ plan, onSubscribe, index }) {
  const color = PLAN_COLORS[plan.title] || '#0ea5e9';
  const isCustom = plan.monthly === 'Custom';
  const isFree = plan.monthlyRaw === 0;

  const handleClick = () => {
    if (plan.ctaPath?.startsWith('mailto:')) {
      window.open(plan.ctaPath, '_blank');
    } else if (isFree) {
      // already on free trial
    } else {
      onSubscribe(plan.title, plan.monthly, plan.id);
    }
  };

  return (
    <Box sx={{
      position: 'relative',
      background: plan.popular
        ? `linear-gradient(160deg, rgba(14,165,233,0.07) 0%, rgba(139,92,246,0.07) 100%)`
        : 'rgba(255,255,255,0.025)',
      border: plan.popular
        ? '1.5px solid rgba(14,165,233,0.4)'
        : '1px solid rgba(255,255,255,0.07)',
      borderRadius: '24px',
      p: 3.5,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      animation: `${fadeUp} 0.5s ease ${index * 0.08}s both`,
      boxShadow: plan.popular ? `0 0 0 1px ${color}25, 0 24px 60px ${color}18` : 'none',
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
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: '14px',
            background: `${color}15`, border: `1px solid ${color}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color,
          }}>
            {PLAN_ICONS[plan.title] || <Diamond sx={{ fontSize: 22 }} />}
          </Box>
          {!isCustom && !isFree && (
            <Chip label="Billed monthly" size="small" sx={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#475569', fontWeight: 600, fontSize: '0.7rem', borderRadius: '50px',
            }} />
          )}
        </Box>

        <Typography sx={{ color, fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.75 }}>
          {plan.title}
        </Typography>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.75, mb: 1 }}>
          {isCustom ? (
            <Typography sx={{ color: GOLD, fontWeight: 800, fontSize: '2rem', lineHeight: 1 }}>
              Custom
            </Typography>
          ) : (
            <>
              <Typography sx={{ color: '#f8fafc', fontWeight: 900, fontSize: '3rem', lineHeight: 1, letterSpacing: '-0.04em' }}>
                {plan.monthly}
              </Typography>
              {!isFree && (
                <Typography sx={{ color: '#475569', fontSize: '0.9rem', mb: 0.5 }}>/mo</Typography>
              )}
            </>
          )}
        </Box>

        <Typography sx={{ color: '#64748b', fontSize: '0.87rem', lineHeight: 1.6 }}>
          {plan.description}
        </Typography>
      </Box>

      {/* Divider */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 2.5 }} />

      {/* Features */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3.5 }}>
        {plan.features.map(({ label, included }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ flexShrink: 0 }}>
              {included ? (
                <CheckCircle sx={{ fontSize: 16, color }} />
              ) : (
                <Close sx={{ fontSize: 16, color: '#374151' }} />
              )}
            </Box>
            <Typography sx={{
              color: included ? '#cbd5e1' : '#374151',
              fontSize: '0.88rem',
              fontWeight: included ? 500 : 400,
              lineHeight: 1.4,
            }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* CTA */}
      <Button
        fullWidth
        onClick={handleClick}
        disabled={isFree}
        variant={plan.popular ? 'contained' : 'outlined'}
        endIcon={!isFree && <ArrowForward sx={{ fontSize: 16 }} />}
        sx={{
          py: 1.5, borderRadius: '50px', fontWeight: 700, fontSize: '0.93rem',
          textTransform: 'none',
          ...(isFree ? {
            background: 'rgba(255,255,255,0.04)', color: '#374151',
            border: '1px solid rgba(255,255,255,0.07)', cursor: 'default',
          } : plan.popular ? {
            background: G, color: '#fff',
            boxShadow: `0 6px 24px ${color}40`,
            '&:hover': { transform: 'translateY(-1px)', boxShadow: `0 8px 32px ${color}55}` },
          } : isCustom ? {
            background: `${GOLD}15`, color: GOLD,
            border: `1.5px solid ${GOLD}40`,
            '&:hover': { background: `${GOLD}25`, borderColor: GOLD },
          } : {
            background: `${color}12`, color,
            border: `1.5px solid ${color}35`,
            '&:hover': { background: `${color}22`, borderColor: color },
          }),
        }}
      >
        {isFree ? 'Current plan (Free)' : plan.cta}
      </Button>
    </Box>
  );
}

// ── Main component ────────────────────────────────────────────────────────
const SubscriptionComponent = () => {
  const [user, setUser] = useState({ username: '', userId: '' });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTier, setCurrentTier] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    loadCurrentTier();
  }, []);

  const loadCurrentTier = async () => {
    try {
      setIsLoading(true);
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      if (stored.userId) {
        const resp = await subscriptionAPI.getSubscription(stored.userId);
        setCurrentTier(resp?.tier || 'free_trial');
      }
    } catch { setCurrentTier('free_trial'); }
    finally { setIsLoading(false); }
  };

  const handleSubscribe = (title, monthly, tierId) => {
    setSelectedPlan({ title, monthly, tierId });
    setIsModalOpen(true);
  };

  const getAmountInCents = (monthly) =>
    parseInt((monthly || '0').replace(/[^0-9]/g, '')) * 100;

  return (
    <Box sx={{ background: '#07071a', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <KenteBg />

      {/* Ambient glow */}
      <Box sx={{
        position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)',
        width: 700, height: 400, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(14,165,233,0.09) 0%, transparent 70%)',
        animation: `${pulseGlow} 8s ease-in-out infinite`, pointerEvents: 'none',
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 8 } }}>

        {/* ── Header ─────────────────────────────────── */}
        <Box sx={{ textAlign: 'center', mb: 7, animation: `${fadeUp} 0.5s ease both` }}>
          <Chip label="Choose Your Plan" size="small" sx={{
            background: `rgba(245,158,11,0.12)`, border: `1px solid rgba(245,158,11,0.3)`,
            color: GOLD, fontWeight: 700, borderRadius: '50px', mb: 2.5,
            '& .MuiChip-label': { px: 2 },
          }} />
          <Typography sx={{
            color: '#f8fafc', fontWeight: 800,
            fontSize: { xs: '2rem', md: '2.8rem' },
            letterSpacing: '-0.03em', lineHeight: 1.1, mb: 1.5,
          }}>
            Scale as you grow.{' '}
            <Box component="span" sx={{ background: G, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Pay as you go.
            </Box>
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '1rem', maxWidth: 480, mx: 'auto', lineHeight: 1.7 }}>
            No hidden fees. Upgrade, downgrade, or cancel anytime.
          </Typography>

          {/* Current plan badge */}
          {currentTier && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mt: 2.5, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '50px', px: 2, py: 0.75 }}>
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              <Typography sx={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>
                Active plan: {currentTier === 'free_trial' ? 'Free Trial' : currentTier}
              </Typography>
            </Box>
          )}
        </Box>

        {/* ── Plan cards ─────────────────────────────── */}
        <Grid container spacing={3} justifyContent="center" alignItems="stretch" sx={{ mb: 7 }}>
          {PLANS.map((plan, i) => (
            <Grid item xs={12} sm={6} md={3} key={plan.id}>
              <PlanCard plan={plan} onSubscribe={handleSubscribe} index={i} />
            </Grid>
          ))}
        </Grid>

        {/* ── Trust strip ────────────────────────────── */}
        <Box sx={{
          display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
          gap: { xs: 2.5, md: 5 }, animation: `${fadeUp} 0.5s ease 0.4s both`,
          py: 3, borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          {[
            { icon: <VerifiedUser sx={{ fontSize: 16, color: '#10b981' }} />, text: 'Secure Stripe payments' },
            { icon: <Bolt sx={{ fontSize: 16, color: '#0ea5e9' }} />, text: 'Instant activation' },
            { icon: <Lock sx={{ fontSize: 16, color: '#8b5cf6' }} />, text: 'Cancel anytime' },
          ].map(({ icon, text }) => (
            <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {icon}
              <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>{text}</Typography>
            </Box>
          ))}
        </Box>

        {/* ── Enterprise callout ─────────────────────── */}
        <Box sx={{
          mt: 6, p: { xs: 4, md: 5 },
          background: `rgba(245,158,11,0.05)`,
          border: `1px solid rgba(245,158,11,0.15)`,
          borderRadius: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 3,
          animation: `${fadeUp} 0.5s ease 0.5s both`,
        }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
              <Workspaces sx={{ color: GOLD, fontSize: 20 }} />
              <Typography sx={{ color: GOLD, fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Enterprise Plus</Typography>
            </Box>
            <Typography sx={{ color: '#f8fafc', fontWeight: 700, fontSize: { xs: '1.2rem', md: '1.4rem' }, mb: 0.5 }}>
              Need unlimited scale?
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
              borderColor: `${GOLD}40`, color: GOLD, fontWeight: 700, px: 3, py: 1.4,
              borderRadius: '50px', whiteSpace: 'nowrap', textTransform: 'none',
              '&:hover': { borderColor: GOLD, background: `${GOLD}10` },
            }}
          >
            Talk to Sales
          </Button>
        </Box>
      </Container>

      {/* ── Stripe checkout modal ─────────────────────── */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
      >
        <Box sx={{
          width: { xs: '95%', sm: 500 }, maxHeight: '90vh', overflow: 'auto',
          background: '#0d0d1f', border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '24px', outline: 'none',
        }}>
          {/* Modal top bar */}
          <Box sx={{ height: 3, background: G, borderRadius: '24px 24px 0 0' }} />
          <Box sx={{
            px: 3.5, py: 2.5,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <Box>
              <Typography sx={{ color: '#f8fafc', fontWeight: 700, fontSize: '1.1rem' }}>
                Upgrade to {selectedPlan?.title}
              </Typography>
              <Typography sx={{ color: '#475569', fontSize: '0.82rem', mt: 0.25 }}>
                {selectedPlan?.monthly}/month
              </Typography>
            </Box>
            <Box
              onClick={() => setIsModalOpen(false)}
              sx={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#64748b', transition: 'all 0.2s ease',
                '&:hover': { background: 'rgba(255,255,255,0.1)', color: '#f8fafc' },
              }}
            >
              <Close sx={{ fontSize: 18 }} />
            </Box>
          </Box>
          <Box sx={{ p: 3.5 }}>
            {selectedPlan && (
              <StripeCheckoutForm
                amount={getAmountInCents(selectedPlan.monthly)}
                tier={selectedPlan.title}
                tierId={selectedPlan.tierId}
                userId={user.userId}
                onClose={() => setIsModalOpen(false)}
              />
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default SubscriptionComponent;

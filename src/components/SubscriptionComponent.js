import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Button, Modal, Container,
  List, ListItem, ListItemIcon, ListItemText, Chip, CircularProgress,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { LocalAtm, Diamond, Rocket, Close } from '@mui/icons-material';
import { subscriptionAPI } from '../services/api';
import StripeCheckoutForm from './StripeCheckoutForm';

const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
const GOLD = '#f59e0b';
const GLASS = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px' };

const PLAN_ICONS = { Basic: <LocalAtm />, Pro: <Diamond />, Enterprise: <Rocket /> };
const PLAN_COLORS = { Basic: '#0ea5e9', Pro: '#8b5cf6', Enterprise: GOLD };

const FALLBACK_TIERS = [
  {
    title: 'Basic',
    monthly: '$9',
    feature_descriptions: ['5 hours transcription/mo', '10 documents/mo', 'English + 5 languages', 'Standard quality', 'Email support'],
  },
  {
    title: 'Pro',
    monthly: '$29',
    feature_descriptions: ['20 hours transcription/mo', 'Unlimited documents', '50+ languages', 'Priority processing', 'Chat & email support', 'API access'],
  },
  {
    title: 'Enterprise',
    monthly: 'Custom Pricing',
    feature_descriptions: ['Unlimited transcription', 'Dedicated server', 'Custom language models', 'SLA guarantee', '24/7 priority support', 'Custom integrations'],
  },
];

const PricingCard = ({ tier, isPopular, onSubscribe }) => {
  const color = PLAN_COLORS[tier.title] || '#0ea5e9';
  const isCustom = tier.monthly?.toLowerCase().includes('custom');

  return (
    <Box sx={{
      ...GLASS,
      position: 'relative', overflow: 'hidden',
      border: isPopular ? `1px solid ${color}50` : '1px solid rgba(255,255,255,0.08)',
      boxShadow: isPopular ? `0 0 40px ${color}20` : 'none',
      transition: 'all 0.3s ease',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 16px 40px ${color}20` },
    }}>
      {isPopular && (
        <Box sx={{
          position: 'absolute', top: 16, right: 16,
          background: G, color: '#fff',
          fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
          px: 1.5, py: 0.5, borderRadius: '50px',
        }}>
          Most Popular
        </Box>
      )}

      {/* Header */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{
          width: 52, height: 52, borderRadius: '14px',
          background: `${color}15`, border: `1px solid ${color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color, mb: 2,
        }}>
          {PLAN_ICONS[tier.title] || <Diamond />}
        </Box>
        <Typography sx={{ color: '#f8fafc', fontWeight: 800, fontSize: '1.2rem', mb: 0.5 }}>
          {tier.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
          {!isCustom && (
            <Typography sx={{ color, fontWeight: 900, fontSize: '2.4rem', lineHeight: 1 }}>
              {tier.monthly}
            </Typography>
          )}
          {isCustom ? (
            <Typography sx={{ color: GOLD, fontWeight: 700, fontSize: '1.1rem' }}>Custom Pricing</Typography>
          ) : (
            <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>/month</Typography>
          )}
        </Box>
      </Box>

      {/* Divider */}
      <Box sx={{ height: 1, background: 'rgba(255,255,255,0.06)', mx: 3 }} />

      {/* Features */}
      <List sx={{ px: 2, py: 1.5 }}>
        {(tier.feature_descriptions || []).map((feat, i) => (
          <ListItem key={i} sx={{ py: 0.6, px: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 30 }}>
              <CheckIcon sx={{ color, fontSize: 17 }} />
            </ListItemIcon>
            <ListItemText
              primary={feat}
              primaryTypographyProps={{ sx: { color: '#94a3b8', fontSize: '0.88rem', fontWeight: 500 } }}
            />
          </ListItem>
        ))}
      </List>

      {/* CTA */}
      <Box sx={{ p: 3, pt: 1 }}>
        <Button
          fullWidth variant="contained"
          onClick={() => onSubscribe(tier.title, tier.monthly, tier.id)}
          sx={{
            borderRadius: '50px', py: 1.3, fontWeight: 700, fontSize: '0.9rem',
            textTransform: 'none',
            background: isPopular ? G : `${color}20`,
            color: isPopular ? '#fff' : color,
            border: isPopular ? 'none' : `1px solid ${color}40`,
            boxShadow: isPopular ? `0 4px 20px ${color}40` : 'none',
            '&:hover': {
              background: isPopular ? 'linear-gradient(135deg,#0284c7,#7c3aed)' : `${color}30`,
              boxShadow: isPopular ? `0 8px 28px ${color}50` : `0 4px 16px ${color}20`,
            },
          }}
        >
          {isCustom ? 'Contact Sales' : `Get ${tier.title}`}
        </Button>
      </Box>
    </Box>
  );
};

const SubscriptionComponent = () => {
  const [user, setUser] = useState({ username: '', userId: '' });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pricingTiers, setPricingTiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    loadPricingTiers();
  }, []);

  const loadPricingTiers = async () => {
    try {
      setIsLoading(true);
      const response = await subscriptionAPI.getPricingTiers();
      const tiers = response.pricing_tiers || [];
      setPricingTiers(tiers.length ? tiers : FALLBACK_TIERS);
    } catch {
      setPricingTiers(FALLBACK_TIERS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = (title, monthly, tierId) => {
    if (monthly?.toLowerCase().includes('custom')) {
      window.open('mailto:labteric@gmail.com?subject=Enterprise%20Plan%20Inquiry', '_blank');
      return;
    }
    setSelectedPlan({ title, monthly, tierId });
    setIsModalOpen(true);
  };

  const getAmountInCents = (monthly) =>
    parseInt((monthly || '0').replace(/[^0-9]/g, '')) * 100;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Box sx={{
          display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2,
          background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: '50px', px: 2.5, py: 0.8,
        }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: GOLD }} />
          <Typography sx={{ color: GOLD, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Flexible Plans
          </Typography>
        </Box>
        <Typography sx={{
          fontSize: { xs: '2rem', md: '2.8rem' }, fontWeight: 800, letterSpacing: '-0.02em',
          background: G, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          mb: 1.5, lineHeight: 1.15,
        }}>
          Choose Your Plan
        </Typography>
        <Typography sx={{ color: '#64748b', fontSize: '1rem', maxWidth: 500, mx: 'auto' }}>
          Select the perfect plan for your needs. Upgrade or downgrade anytime.
        </Typography>
      </Box>

      {/* Plan Chips */}
      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap', mb: 5 }}>
        {pricingTiers.map((tier, i) => {
          const color = PLAN_COLORS[tier.title] || '#0ea5e9';
          return (
            <Chip
              key={i}
              icon={<Box sx={{ color: `${color} !important` }}>{PLAN_ICONS[tier.title]}</Box>}
              label={tier.title}
              sx={{
                height: 40, borderRadius: '50px', fontWeight: 700, fontSize: '0.88rem',
                background: `${color}15`, border: `1px solid ${color}30`,
                color, px: 1,
                '& .MuiChip-icon': { color: `${color} !important` },
              }}
            />
          );
        })}
      </Box>

      {/* Pricing Cards */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#0ea5e9' }} />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {pricingTiers.map((tier, i) => (
            <Grid item xs={12} md={4} key={i}>
              <PricingCard
                tier={tier}
                isPopular={tier.title === 'Pro' || i === 1}
                onSubscribe={handleSubscribe}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Payment Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
      >
        <Box sx={{
          width: { xs: '95%', sm: 520 }, maxHeight: '90vh', overflow: 'auto',
          background: '#0f0f2d', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px', outline: 'none',
        }}>
          {/* Modal header */}
          <Box sx={{
            height: 3,
            background: G,
          }} />
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <Box>
              <Typography sx={{ color: '#f8fafc', fontWeight: 700, fontSize: '1.1rem' }}>
                Subscribe to {selectedPlan?.title}
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                {selectedPlan?.monthly}/month
              </Typography>
            </Box>
            <Box
              onClick={() => setIsModalOpen(false)}
              sx={{ cursor: 'pointer', color: '#64748b', '&:hover': { color: '#f8fafc' }, lineHeight: 1 }}
            >
              <Close />
            </Box>
          </Box>
          <Box sx={{ p: 3 }}>
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
    </Container>
  );
};

export default SubscriptionComponent;

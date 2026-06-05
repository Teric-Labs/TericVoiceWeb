import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Fade,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Avatar,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Star as StarIcon,
  Rocket as RocketIcon,
  Diamond as DiamondIcon,
  CheckCircle as CheckIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
  Upgrade as UpgradeIcon,
  FlashOn as FlashIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { PLANS } from '../constants/plans';
import { AvoicesProgress } from './progress';
import PaymentModal from './PaymentModal';

const toDisplayTier = (plan) => ({
  ...plan,
  price: plan.monthlyRaw ?? 0,
  feature_descriptions: (plan.features || [])
    .filter((f) => f.included)
    .map((f) => f.label),
});

const PAID_PLANS = PLANS.filter((p) => p.id !== 'free_trial').map(toDisplayTier);

// Enhanced animations
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.3); }
  50% { box-shadow: 0 0 30px rgba(245, 158, 11, 0.6); }
`;

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(245, 158, 11, 0.1)',
    maxWidth: '900px',
    width: '90vw',
    maxHeight: '90vh',
    overflow: 'hidden',
  },
}));

const GradientCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  color: '#111111',
  borderRadius: '20px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, transparent 30%, rgba(17, 17, 17, 0.1) 50%, transparent 70%)',
    backgroundSize: '200% 200%',
    animation: `${shimmer} 3s ease-in-out infinite`,
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  border: '1px solid rgba(245, 158, 11, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(245, 158, 11, 0.15)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
  },
}));

const UpgradeButton = styled(Button)(({ theme }) => ({
  borderRadius: '28px',
  padding: '16px 32px',
  fontSize: '1.1rem',
  fontWeight: 700,
  textTransform: 'none',
  background: 'linear-gradient(45deg, #f59e0b, #d97706)',
  boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)',
  animation: `${glow} 2s ease-in-out infinite`,
  '&:hover': {
    background: 'linear-gradient(45deg, #d97706, #b45309)',
    boxShadow: '0 12px 24px rgba(245, 158, 11, 0.4)',
    transform: 'translateY(-2px)',
  },
}));

const FloatingIcon = styled(Box)(({ theme }) => ({
  animation: `${float} 3s ease-in-out infinite`,
  animationDelay: '0.5s',
}));

const UpgradePromptModal = () => {
  const [open, setOpen] = useState(false);
  const [currentUsage] = useState(0);
  const [limit] = useState(0);
  const [endpoint, setEndpoint] = useState('');
  const [tier] = useState('free_trial');

  const [pricingTiers, setPricingTiers] = useState(PAID_PLANS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState(
    PAID_PLANS.find((p) => p.popular) || PAID_PLANS[0] || null
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [successSnack, setSuccessSnack] = useState({ open: false, message: '' });

  const onClose = () => setOpen(false);

  useEffect(() => {
    const handleLimitExceeded = (e) => {
      setOpen(true);
      setEndpoint(e.detail?.endpoint || '');
    };
    window.addEventListener('subscription-limit-exceeded', handleLimitExceeded);
    return () => window.removeEventListener('subscription-limit-exceeded', handleLimitExceeded);
  }, []);

  const loadPricingTiers = useCallback(() => {
    setIsLoading(true);
    const allTiers = PLANS.map(toDisplayTier);
    const paid = allTiers.filter((p) => p.id !== 'free_trial');
    setPricingTiers(paid);

    const currentTierIndex = allTiers.findIndex((t) => t.id === tier);
    const nextTier =
      currentTierIndex >= 0 && currentTierIndex < allTiers.length - 1
        ? allTiers[currentTierIndex + 1]
        : paid.find((p) => p.popular) || paid[0];

    if (nextTier && nextTier.id !== 'free_trial') {
      setSelectedTier(nextTier);
    } else {
      setSelectedTier(paid.find((p) => p.popular) || paid[0] || null);
    }
    setIsLoading(false);
  }, [tier]);

  useEffect(() => {
    if (open) {
      loadPricingTiers();
    }
  }, [open, loadPricingTiers]);

  const handleUpgrade = () => {
    if (!selectedTier) return;

    if (selectedTier.monthly === 'Custom' || selectedTier.ctaPath?.startsWith('mailto:')) {
      window.open(selectedTier.ctaPath || 'mailto:phosaico@gmail.com?subject=Enterprise%20Plus%20Inquiry', '_blank');
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (upgradedTier) => {
    setShowPaymentModal(false);
    setSuccessSnack({
      open: true,
      message: `Successfully upgraded to ${upgradedTier?.title || 'new plan'}! Your subscription is now active.`,
    });
    // Close the upgrade modal after a brief moment so user sees the success
    setTimeout(() => onClose(), 3000);
  };

  const getUsagePercentage = () => {
    return limit > 0 ? Math.round((currentUsage / limit) * 100) : 0;
  };

  const getTierIcon = (tierId) => {
    switch (tierId) {
      case 'free_trial': return <StarIcon />;
      case 'classic': return <RocketIcon />;
      case 'classic_pro': return <DiamondIcon />;
      case 'enterprise_plus': return <FlashIcon />;
      default: return <UpgradeIcon />;
    }
  };

  const getTierColor = (tierId) => {
    switch (tierId) {
      case 'free_trial': return '#9e9e9e';
      case 'classic': return '#f59e0b';
      case 'classic_pro': return '#d97706';
      case 'enterprise_plus': return '#b45309';
      default: return '#f59e0b';
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={500}
    >
      <DialogTitle sx={{ p: 0, position: 'relative' }}>
        <GradientCard elevation={0}>
          <Box sx={{ p: 4, position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FloatingIcon>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(17, 17, 17, 0.2)', 
                    width: 56, 
                    height: 56,
                    animation: `${pulse} 2s ease-in-out infinite`
                  }}>
                    <UpgradeIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                </FloatingIcon>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                    🚀 Upgrade Your Plan
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Unlock unlimited potential with premium features
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={onClose}
                aria-label="Close upgrade modal"
                sx={{
                  color: '#111111',
                  bgcolor: 'rgba(17, 17, 17, 0.1)',
                  '&:hover': { bgcolor: 'rgba(17, 17, 17, 0.2)' }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            
            {/* Usage Status */}
            <Paper sx={{ 
              bgcolor: 'rgba(17, 17, 17, 0.1)', 
              p: 3, 
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Current Usage: {endpoint}
                </Typography>
                <Chip 
                  label={`${currentUsage}/${limit}`} 
                  sx={{ 
                    bgcolor: 'rgba(17, 17, 17, 0.2)', 
                    color: '#111111',
                    fontWeight: 600
                  }} 
                />
              </Box>
              <AvoicesProgress variant="determinate" value={getUsagePercentage()} size="md" tone="quota" showValue />
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                {getUsagePercentage()}% of your monthly limit used
              </Typography>
            </Paper>
          </Box>
        </GradientCard>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
          Choose Your Perfect Plan
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <AvoicesProgress variant="indeterminate" size="sm" sx={{ width: '100%' }} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {pricingTiers.map((tier) => (
              <Grid item xs={12} md={6} lg={3} key={tier.id}>
                <FeatureCard
                  sx={{
                    cursor: 'pointer',
                    border: selectedTier?.id === tier.id ? '2px solid #f59e0b' : '1px solid rgba(245, 158, 11, 0.1)',
                    transform: selectedTier?.id === tier.id ? 'scale(1.02)' : 'scale(1)',
                  }}
                  onClick={() => setSelectedTier(tier)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: getTierColor(tier.id), 
                        mr: 2,
                        width: 40,
                        height: 40
                      }}>
                        {getTierIcon(tier.id)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {tier.title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: getTierColor(tier.id) }}>
                          {tier.monthly}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                      {tier.description}
                    </Typography>

                    <List dense sx={{ mb: 3 }}>
                      {tier.feature_descriptions?.slice(0, 4).map((feature, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature} 
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    {tier.popular && (
                      <Chip 
                        label="Most Popular" 
                        color="primary" 
                        size="small" 
                        sx={{ mb: 2 }}
                      />
                    )}
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Benefits Section */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(245, 158, 11, 0.05)', borderRadius: '16px' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
            🎯 Why Upgrade?
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SpeedIcon color="primary" />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Lightning Fast
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Priority processing and faster response times
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SecurityIcon color="primary" />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Enterprise Security
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bank-level security and data protection
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SupportIcon color="primary" />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    24/7 Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dedicated support team always ready to help
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Button 
            onClick={onClose} 
            sx={{ 
              color: 'text.secondary',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
            }}
          >
            Maybe Later
          </Button>
          
          <Stack direction="row" spacing={2} alignItems="center">
            {selectedTier && (
              <Typography variant="body2" color="text.secondary">
                Selected: <strong>{selectedTier.title}</strong>
              </Typography>
            )}
            <UpgradeButton
              onClick={handleUpgrade}
              disabled={!selectedTier || isLoading}
              variant="contained"
              size="large"
              startIcon={<RocketIcon />}
            >
              {selectedTier?.monthly === 'Custom' ? 'Contact Sales' : 'Upgrade Now'}
            </UpgradeButton>
          </Stack>
        </Box>
      </DialogActions>
      
      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        selectedTier={selectedTier}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <Snackbar
        open={successSnack.open}
        autoHideDuration={5000}
        onClose={() => setSuccessSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccessSnack(s => ({ ...s, open: false }))}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          {successSnack.message}
        </Alert>
      </Snackbar>
    </StyledDialog>
  );
};

export default UpgradePromptModal;
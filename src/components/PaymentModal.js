import React, { useState, useEffect } from 'react';
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
  TextField,
  IconButton,
  LinearProgress,
  Alert,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  CreditCard as CreditCardIcon,
  CheckCircle as CheckIcon,
  Lock as LockIcon,
  Star as StarIcon,
  Diamond as DiamondIcon,
  FlashOn as FlashIcon,
  Rocket as RocketIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { subscriptionAPI } from '../services/api';

const stripePromise = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
  : null;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const PaymentModalContent = ({
  open,
  onClose,
  selectedTier,
  onPaymentSuccess
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [activeStep, setActiveStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form states (no raw card data — handled by Stripe's CardElement)
  const [formData, setFormData] = useState({
    email: '',
    cardholderName: '',
    country: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const steps = [
    'Payment Details',
    'Review & Confirm',
    'Processing',
  ];

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setIsProcessing(false);
      setError(null);
      setSuccess(false);
      setFormData({ email: '', cardholderName: '', country: '', address: '', city: '', zipCode: '' });
      setFormErrors({});
    }
  }, [open]);

  const handleNext = () => {
    if (activeStep === 0) {
      if (validateForm()) {
        setActiveStep(1);
      }
    } else if (activeStep === 1) {
      handlePayment();
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    setError(null);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.cardholderName || formData.cardholderName.length < 2) {
      errors.cardholderName = 'Cardholder name is required';
    }
    if (!formData.country) errors.country = 'Country is required';
    if (!formData.address || formData.address.length < 5) errors.address = 'Address is required';
    if (!formData.city || formData.city.length < 2) errors.city = 'City is required';
    if (!formData.zipCode || formData.zipCode.length < 3) errors.zipCode = 'ZIP code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setActiveStep(2);
    setError(null);

    try {
      // Additional validation before payment
      if (!validateForm()) {
        setActiveStep(1);
        setError('Please fix the form errors before proceeding');
        return;
      }

      // Process payment
      const paymentResult = await processStripePayment();
      
      if (paymentResult.success) {
        setSuccess(true);
        setTimeout(() => {
          onPaymentSuccess(selectedTier, paymentResult);
          onClose();
        }, 2000);
      } else {
        throw new Error(paymentResult.error || 'Payment failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      
      // Handle different types of errors
      let errorMessage = 'Payment failed. Please try again.';
      
      if (err.response?.status === 400) {
        errorMessage = 'Invalid payment information. Please check your details.';
      } else if (err.response?.status === 402) {
        errorMessage = 'Payment declined. Please try a different payment method.';
      } else if (err.response?.status === 429) {
        errorMessage = 'Too many payment attempts. Please wait a moment and try again.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setError(errorMessage);
      setActiveStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  const processStripePayment = async () => {
    if (!stripe || !elements) {
      throw new Error('Stripe has not loaded. Please refresh and try again.');
    }

    const cardElement = elements.getElement(CardElement);
    const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: formData.cardholderName,
        email: formData.email,
        address: {
          line1: formData.address,
          city: formData.city,
          country: formData.country,
          postal_code: formData.zipCode,
        },
      },
    });

    if (pmError) throw new Error(pmError.message);

    // Send only paymentMethodId — never raw card data
    const result = await subscriptionAPI.processPayment({
      tierId: selectedTier?.id,
      paymentMethodId: paymentMethod.id,
      amount: (selectedTier?.price || 0) * 100,
      currency: 'USD',
      email: formData.email,
    });

    if (result.success) {
      return { success: true, transactionId: result.transactionId };
    }
    return { success: false, error: result.error || 'Payment failed' };
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const getTierIcon = (tierId) => {
    switch (tierId) {
      case 'classic': return <RocketIcon />;
      case 'classic_pro': return <DiamondIcon />;
      case 'enterprise_plus': return <FlashIcon />;
      default: return <StarIcon />;
    }
  };

  const getTierColor = (tierId) => {
    switch (tierId) {
      case 'classic': return '#1976d2';
      case 'classic_pro': return '#9c27b0';
      case 'enterprise_plus': return '#f57c00';
      default: return '#1976d2';
    }
  };

  const renderPaymentDetailsStep = () => (
    <Box sx={{ animation: `${slideIn} 0.5s ease-out` }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Payment Details
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            error={!!formErrors.email}
            helperText={formErrors.email}
            sx={{ borderRadius: '12px' }}
          />
        </Grid>
        
        {/* Card Payment Details — secured by Stripe */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: 'rgba(25, 118, 210, 0.05)', borderRadius: '16px', border: '1px solid rgba(25, 118, 210, 0.1)' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CreditCardIcon color="primary" />
              Card Payment Details
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>Card details</Typography>
                <Box sx={{
                  p: 1.75, border: '1px solid rgba(0,0,0,0.23)', borderRadius: '12px',
                  '&:hover': { borderColor: 'primary.main' },
                }}>
                  <CardElement options={{
                    style: {
                      base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                      invalid: { color: '#f44336' },
                    },
                    hidePostalCode: true,
                  }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.75 }}>
                  <LockIcon sx={{ fontSize: 13, color: 'success.main' }} />
                  <Typography variant="caption" color="text.secondary">
                    Secured by Stripe. Card data is never stored on our servers.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cardholder Name"
                  value={formData.cardholderName}
                  onChange={(e) => setFormData({...formData, cardholderName: e.target.value})}
                  error={!!formErrors.cardholderName}
                  helperText={formErrors.cardholderName}
                  placeholder="John Doe"
                  sx={{ borderRadius: '12px' }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  error={!!formErrors.country}
                  helperText={formErrors.country}
                  placeholder="United States"
                  sx={{ borderRadius: '12px' }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  error={!!formErrors.address}
                  helperText={formErrors.address}
                  placeholder="123 Main Street"
                  sx={{ borderRadius: '12px' }}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  error={!!formErrors.city}
                  helperText={formErrors.city}
                  placeholder="New York"
                  sx={{ borderRadius: '12px' }}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  error={!!formErrors.zipCode}
                  helperText={formErrors.zipCode}
                  placeholder="10001"
                  sx={{ borderRadius: '12px' }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderReviewStep = () => (
    <Box sx={{ animation: `${slideIn} 0.5s ease-out` }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Review Your Order
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '16px', border: '1px solid rgba(25, 118, 210, 0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '12px', 
                  bgcolor: `${getTierColor(selectedTier?.id)}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: getTierColor(selectedTier?.id)
                }}>
                  {getTierIcon(selectedTier?.id)}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedTier?.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: getTierColor(selectedTier?.id) }}>
                    {selectedTier?.monthly || 'N/A'}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedTier?.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '16px', border: '1px solid rgba(25, 118, 210, 0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Payment Summary
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Plan Price</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedTier?.monthly || 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Payment Method</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Credit Card
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {selectedTier?.monthly || 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LockIcon sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Secure payment powered by Stripe
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderProcessingStep = () => (
    <Box sx={{ animation: `${slideIn} 0.5s ease-out`, textAlign: 'center', py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <CreditCardIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Processing Payment
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Please wait while we process your payment...
        </Typography>
        <LinearProgress sx={{ borderRadius: '8px', height: 8 }} />
      </Box>
      
      <Alert severity="info" sx={{ borderRadius: '12px', textAlign: 'left' }}>
        <Typography variant="body2">
          <strong>Tip:</strong> Keep this window open while your payment is being processed. 
          You'll be redirected automatically once the payment is complete.
        </Typography>
      </Alert>
    </Box>
  );

  const renderSuccessStep = () => (
    <Box sx={{ animation: `${slideIn} 0.5s ease-out`, textAlign: 'center', py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: 'success.main' }}>
          Payment Successful!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your subscription has been activated. You can now enjoy all premium features.
        </Typography>
      </Box>
    </Box>
  );

  if (!selectedTier) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '600px'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '20px 20px 0 0'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Complete Your Purchase
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {error}
          </Alert>
        )}
        
        {success ? (
          renderSuccessStep()
        ) : activeStep === 0 ? (
          renderPaymentDetailsStep()
        ) : activeStep === 1 ? (
          renderReviewStep()
        ) : activeStep === 2 ? (
          renderProcessingStep()
        ) : null}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0 || isProcessing}
            startIcon={<ArrowBackIcon />}
            sx={{ borderRadius: '12px' }}
          >
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={isProcessing}
            variant="contained"
            endIcon={activeStep === steps.length - 1 ? <CheckIcon /> : <ArrowForwardIcon />}
            sx={{ 
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            {activeStep === steps.length - 1 ? 'Complete Payment' : 'Continue'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

// Wrap with Stripe Elements so inner component can use useStripe/useElements
const PaymentModal = (props) => (
  <Elements stripe={stripePromise}>
    <PaymentModalContent {...props} />
  </Elements>
);

export default PaymentModal;
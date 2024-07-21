import React, { useState } from 'react';
import { Button, Typography, Box, CircularProgress, Alert, Container, CssBaseline, Snackbar } from '@mui/material';
import { PaymentElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe("pk_test_51OoNCdDqmFs47Ob6SjZEbrwKYGtagQUoqytYuGG6wkQRy0VFvZVqduRtCVx9WH1HpXo8b8Tbx7QSnfcOyhKQea4T000RTDwWLA");

const CheckoutForm = ({ amount, tier, tierId, userId, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const paymentServerUrl = "https://teric-asr-api-wlivbm2klq-ue.a.run.app/create-checkout-session";

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("Stripe hasn't loaded yet. Please try again.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      const formData = new FormData();
      formData.append('tier_id', tierId);
      formData.append('price', amount);
      formData.append('tier', tier);
      formData.append('user_id', userId);

      // Create the PaymentIntent on your server
      const response = await axios.post(paymentServerUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status !== 200) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const { clientSecret } = response.data;

      if (!clientSecret) {
        throw new Error('No client secret received from the server');
      }

      const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: 'https://example.com/order/complete',
        },
        redirect: 'if_required',
      });

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        setSnackbarMessage('Subscription completed successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        onClose();
      } else {
        throw new Error(`Unexpected payment status: ${paymentIntent.status}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred');
      setSnackbarMessage('Payment failed. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Complete Your Payment
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
          <PaymentElement />
          <Box sx={{ position: 'relative', mt: 2 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={!stripe || !elements || loading}
            >
              {loading ? 'Processing...' : 'Pay'}
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  color: 'primary.main',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

const StripeCheckoutForm = ({ amount, tier, tierId, userId, onClose }) => {
  const options = {
    mode: 'payment',
    amount: amount,
    currency: 'usd',
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm amount={amount} tier={tier} tierId={tierId} userId={userId} onClose={onClose} />
    </Elements>
  );
};

export default StripeCheckoutForm;

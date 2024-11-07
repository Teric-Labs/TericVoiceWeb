import React, { useState, createContext, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  Grid, 
  Link, 
  Modal, 
  Paper, 
  TextField, 
  Typography, 
  CircularProgress, 
  IconButton, 
  InputAdornment,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Google, 
  Email, 
  Lock, 
  Visibility, 
  VisibilityOff 
} from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, styled } from '@mui/material/styles';
import { useAuth } from './AuthContext'; // Ensure this path is correct

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

const StyledPaper = styled(Paper)(({ theme }) => ({
  maxWidth: '450px',
  width: '90%',
  margin: '40px auto',
  padding: '40px',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: '12px',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 1.5,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.05)',
    },
    '&.Mui-focused': {
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    },
  },
}));

const SignInComponent = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState('signIn');
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState({ username: '', userId: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [errors, setErrors] = useState({});

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const handleSignInWithGoogle = () => {
    // Placeholder for Google Sign-In integration
    setSnackbar({ open: true, message: 'Google Sign-In not implemented yet', severity: 'info' });
  };

  const toggleAuthMode = useCallback(() => {
    setAuthMode(prevMode => prevMode === 'signIn' ? 'signUp' : 'signIn');
    setErrors({});
  }, []);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (authMode === 'signUp') {
      if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (confirmPassword !== password) newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (authMode === 'signUp') {
        await handleSignUp();
      } else {
        await handleSignIn();
      }
    } catch (error) {
      console.error(`Error ${authMode === 'signUp' ? 'registering' : 'logging in'} the user:`, error);
      setSnackbar({
        open: true,
        message: `${authMode === 'signUp' ? 'Registration' : 'Login'} failed. Please try again.`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    const response = await axios.post('http://127.0.0.1:8000/register', {
      email,
      password,
      confirm_password: confirmPassword
    });
    console.log(response.data);
    setSnackbar({ open: true, message: 'Registration successful! Please sign in.', severity: 'success' });
    toggleAuthMode();
  };

  const handleSignIn = async () => {
    const response = await axios.post('http://127.0.0.1:8000/login', { email, password });
    setUser({ username: response.data[0].username, userId: response.data[0].user_id });
    localStorage.setItem('user', JSON.stringify({ username: response.data[0].username, userId: response.data[0].user_id }));
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: matches ? 400 : '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: theme.shape.borderRadius * 2,
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <StyledPaper elevation={3}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 700, color: theme.palette.primary.main }}>
          {authMode === 'signIn' ? 'Welcome Back' : 'Join Us'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <StyledTextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {authMode === 'signUp' && (
            <StyledTextField
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
              }}
            />
          )}
          <FormControlLabel
            control={<Checkbox name="rememberMe" color="primary" />}
            label="Remember me"
            sx={{ mt: 2, mb: 2 }}
          />
          {loading ? (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress />
            </Box>
          ) : (
            <StyledButton type="submit" fullWidth variant="contained" sx={{ mb: 2 }}>
              {authMode === 'signIn' ? 'Sign In' : 'Sign Up'}
            </StyledButton>
          )}
        </form>
        <StyledButton
          fullWidth
          variant="outlined"
          startIcon={<Google />}
          onClick={handleSignInWithGoogle}
          sx={{ mb: 2 }}
        >
          Sign in with Google
        </StyledButton>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Link
              component="button"
              variant="body2"
              onClick={handleOpenModal}
              sx={{ textDecoration: 'none' }}
            >
              Forgot Password?
            </Link>
          </Grid>
          <Grid item>
            <Link
              component="button"
              variant="body2"
              onClick={toggleAuthMode}
              sx={{ textDecoration: 'none' }}
            >
              {authMode === 'signIn' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </Link>
          </Grid>
        </Grid>
      </StyledPaper>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="reset-password-modal-title"
        aria-describedby="reset-password-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="reset-password-modal-title" variant="h6" component="h2">
            Reset Password
          </Typography>
          <Typography id="reset-password-modal-description" sx={{ mt: 2 }}>
            Please enter your email address to reset your password.
          </Typography>
          <Box component="form" sx={{ mt: 2 }}>
            <StyledTextField
              autoFocus
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
            />
            <StyledButton type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Reset Password
            </StyledButton>
          </Box>
        </Box>
      </Modal>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </UserContext.Provider>
  );
};

export default SignInComponent;
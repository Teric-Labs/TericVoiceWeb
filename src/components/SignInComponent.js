import React, { useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoogleIcon from '@mui/icons-material/Google';
import { Box, Button, Checkbox, FormControlLabel, Grid, Link, Modal, Paper, TextField, Typography, CircularProgress } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useAuth } from './AuthContext'; // Ensure the correct path to your AuthContext

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

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

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: matches ? 400 : '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const handleSignInWithGoogle = () => {
    // Placeholder for Google Sign-In integration
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signIn' ? 'signUp' : 'signIn');
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleConfirmPasswordChange = (event) => setConfirmPassword(event.target.value);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://teric-asr-api-wlivbm2klq-ue.a.run.app/register', {
        email, 
        password,
        confirm_password: confirmPassword
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error registering the user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://teric-asr-api-wlivbm2klq-ue.a.run.app/login', { email, password });
      setUser({ username: response.data[0].username, userId: response.data[0].user_id });
      localStorage.setItem('user', JSON.stringify({ username: response.data[0].username, userId: response.data[0].user_id }));
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in the user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Paper elevation={3} sx={{ maxWidth: matches ? 450 : '90%', margin: '40px auto', padding: '20px' }}>
        {authMode === 'signIn' ? (
          <>
            {/* <Button
              startIcon={<GoogleIcon />}
              variant="contained"
              fullWidth
              onClick={handleSignInWithGoogle}
              sx={{ mb: 4, height: '56px' }}
            >
              Sign In with Google
            </Button> */}
            <form onSubmit={handleSignIn}>
              <TextField label="Email" type="email" fullWidth required margin="dense" value={email} onChange={handleEmailChange} />
              <TextField label="Password" type="password" fullWidth required margin="dense" value={password} onChange={handlePasswordChange} />
              <FormControlLabel
                control={<Checkbox name="rememberMe" />}
                label="Remember me"
                sx={{ mt: 2, mb: 1 }}
              />
              {loading ? <CircularProgress sx={{ display: 'block', mx: 'auto' }} /> : (
                <Button type="submit" fullWidth variant="contained" sx={{ mb: 2 }}>
                  Sign In
                </Button>
              )}
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Link href="#" variant="body2" onClick={handleOpenModal}>Forgot Password?</Link>
                </Grid>
                <Grid item>
                  <Typography variant="body2">
                    Don't have an account yet? <Link href="#" onClick={toggleAuthMode} underline="hover">Join Us</Link>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </>
        ) : (
          <>
            {/* <Button
              startIcon={<GoogleIcon />}
              variant="contained"
              fullWidth
              onClick={handleSignInWithGoogle}
              sx={{ mb: 4, height: '56px',fontFamily: 'Poppins' }}
            >
              Sign Up with Google
            </Button> */}
            <form onSubmit={handleSignUp}>
              <TextField label="Email" type="email" fullWidth required margin="dense" value={email} onChange={handleEmailChange} />
              <TextField label="Password" type="password" fullWidth required margin="dense" value={password} onChange={handlePasswordChange} />
              <TextField label="Confirm Password" type="password" fullWidth required margin="dense" value={confirmPassword} onChange={handleConfirmPasswordChange} />
              <FormControlLabel
                control={<Checkbox name="rememberMe" />}
                label="Remember me"
                sx={{ mt: 2, mb: 1,fontFamily: 'Poppins' }}
              />
              {loading ? <CircularProgress sx={{ display: 'block', mx: 'auto' }} /> : (
                <Button type="submit" fullWidth variant="contained" sx={{ mb: 2,fontFamily: 'Poppins' }}>
                  Sign Up
                </Button>
              )}
              <Typography variant="body2" sx={{ textAlign: 'center' ,fontFamily: 'Poppins'}}>
                Already have an account? <Link href="#" onClick={toggleAuthMode} underline="hover">Sign In</Link>
              </Typography>
            </form>
          </>
        )}
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
              Please type your email address to reset your password.
            </Typography>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2,fontFamily: 'Poppins' }}>
                Submit
              </Button>
            </Box>
          </Box>
        </Modal>
      </Paper>
    </UserContext.Provider>
  );
};

export default SignInComponent;

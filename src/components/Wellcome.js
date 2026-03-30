import React, { useState } from "react";
import {
  Box, Typography, Button, Alert,
} from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { GraphicEq } from '@mui/icons-material';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from './firebaseConfig';

// ── Animations ─────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const pulseGlow = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(14,165,233,0); }
  50%      { box-shadow: 0 0 0 8px rgba(14,165,233,0.08); }
`;

const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';

// Subtle Kente SVG background
function KenteBg() {
  return (
    <Box component="svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"
      sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03, pointerEvents: 'none' }}
    >
      <defs>
        <pattern id="k-auth" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
          <line x1="0" y1="20" x2="40" y2="20" stroke="#8b5cf6" strokeWidth="0.4" />
          <line x1="20" y1="0" x2="20" y2="40" stroke="#8b5cf6" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#k-auth)" />
    </Box>
  );
}

const Welcome = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const u = result.user;
      localStorage.setItem('user', JSON.stringify({ username: u.displayName, userId: u.uid }));
      localStorage.setItem('loginAt', Date.now().toString());
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch {
      setError('Sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#07071a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      px: 2,
    }}>
      <KenteBg />

      {/* Ambient glow */}
      <Box sx={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 480, height: 480, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14,165,233,0.09) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <Box sx={{
        width: '100%', maxWidth: 400,
        position: 'relative', zIndex: 1,
        animation: `${fadeUp} 0.5s ease both`,
      }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
          <Box sx={{
            width: 52, height: 52, borderRadius: '14px',
            background: G,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(14,165,233,0.35)',
            mb: 2,
          }}>
            <GraphicEq sx={{ color: '#fff', fontSize: 26 }} />
          </Box>
          <Typography sx={{
            fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.02em',
            background: G,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            A·VOICES
          </Typography>
        </Box>

        {/* Headline */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography sx={{
            color: '#f8fafc', fontWeight: 700, fontSize: '1.6rem',
            letterSpacing: '-0.02em', lineHeight: 1.25, mb: 1,
          }}>
            Welcome back
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Sign in to your voice AI workspace
          </Typography>
        </Box>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{
            mb: 3, borderRadius: '12px',
            background: 'rgba(239,68,68,0.08)', color: '#f87171',
            border: '1px solid rgba(239,68,68,0.2)',
            fontSize: '0.85rem',
          }}>
            {error}
          </Alert>
        )}

        {/* Google Sign-In Button */}
        <Button
          fullWidth
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          startIcon={!isLoading && (
            <Box component="svg" viewBox="0 0 24 24" sx={{ width: 18, height: 18, flexShrink: 0 }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </Box>
          )}
          sx={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#f8fafc',
            fontWeight: 600,
            fontSize: '0.95rem',
            py: 1.6,
            borderRadius: '12px',
            mb: 2.5,
            justifyContent: 'center',
            gap: 1.5,
            transition: 'all 0.2s ease',
            animation: `${pulseGlow} 3s ease-in-out infinite`,
            '&:hover': {
              background: 'rgba(255,255,255,0.1)',
              borderColor: 'rgba(14,165,233,0.3)',
              transform: 'translateY(-1px)',
            },
            '&.Mui-disabled': { background: 'rgba(255,255,255,0.03)', color: '#374151' },
          }}
        >
          {isLoading ? 'Signing in…' : 'Continue with Google'}
        </Button>

        {/* Divider line */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Box sx={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <Typography sx={{ color: '#374151', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>or</Typography>
          <Box sx={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </Box>

        {/* Guest / explore link */}
        <Button
          fullWidth component={Link} to="/"
          variant="outlined"
          sx={{
            borderColor: 'rgba(255,255,255,0.08)', color: '#64748b',
            fontWeight: 600, fontSize: '0.9rem', py: 1.4, borderRadius: '12px',
            '&:hover': { borderColor: 'rgba(139,92,246,0.35)', color: '#a78bfa', background: 'rgba(139,92,246,0.06)' },
          }}
        >
          Explore the platform →
        </Button>

        {/* Trust badges */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mt: 3.5, flexWrap: 'wrap' }}>
          {[
            { dot: '#10b981', text: 'Firebase secured' },
            { dot: '#0ea5e9', text: '50+ languages' },
            { dot: '#8b5cf6', text: 'No credit card' },
          ].map(({ dot, text }) => (
            <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: dot }} />
              <Typography sx={{ color: '#374151', fontSize: '0.76rem', fontWeight: 600 }}>{text}</Typography>
            </Box>
          ))}
        </Box>

        {/* Legal */}
        <Typography sx={{ color: '#374151', fontSize: '0.73rem', textAlign: 'center', mt: 3.5, lineHeight: 1.6 }}>
          By continuing you agree to our{' '}
          <Box component="a" href="/" sx={{ color: '#475569', textDecoration: 'underline', '&:hover': { color: '#0ea5e9' } }}>Terms</Box>
          {' & '}
          <Box component="a" href="/" sx={{ color: '#475569', textDecoration: 'underline', '&:hover': { color: '#0ea5e9' } }}>Privacy Policy</Box>
        </Typography>
      </Box>

      {/* Back nav */}
      <Box
        component={Link} to="/"
        sx={{
          position: 'absolute', top: 28, left: 28,
          display: 'flex', alignItems: 'center', gap: 0.75,
          color: '#374151', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600,
          transition: 'color 0.2s ease',
          '&:hover': { color: '#f8fafc' },
          zIndex: 2,
        }}
      >
        ← A·VOICES
      </Box>
    </Box>
  );
};

export default Welcome;

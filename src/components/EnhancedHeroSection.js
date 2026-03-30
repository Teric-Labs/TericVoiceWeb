import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Chip, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { keyframes } from '@mui/material/styles';
import { ArrowForward } from '@mui/icons-material';

// ── Animations ─────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const pulseGlow = keyframes`
  0%,100% { opacity: 0.5; transform: scale(1); }
  50%      { opacity: 0.85; transform: scale(1.05); }
`;
const waveBar = keyframes`
  0%,100% { transform: scaleY(0.35); }
  50%      { transform: scaleY(1); }
`;

// ── Animated counter ────────────────────────────────────────────────────────
function useCounter(target, duration = 1400) {
  const [count, setCount] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let v = 0;
        const step = parseFloat(target) / (duration / 16);
        const t = setInterval(() => {
          v += step;
          if (v >= parseFloat(target)) { setCount(parseFloat(target)); clearInterval(t); }
          else setCount(v);
        }, 16);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return [count, ref];
}

function Stat({ value, suffix, label, float }) {
  const [count, ref] = useCounter(parseFloat(value));
  const display = float ? count.toFixed(1) : Math.round(count).toLocaleString('en');
  return (
    <Box ref={ref} sx={{ textAlign: 'center' }}>
      <Typography sx={{ fontSize: { xs: '1.7rem', md: '2.1rem' }, fontWeight: 800, color: '#f8fafc', lineHeight: 1, letterSpacing: '-0.03em' }}>
        {display}{suffix}
      </Typography>
      <Typography sx={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600, mt: 0.5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </Typography>
    </Box>
  );
}

// ── Mini waveform ───────────────────────────────────────────────────────────
function Wave() {
  const bars = [0.4, 0.7, 1, 0.55, 0.88, 0.5, 0.8, 1, 0.45, 0.7, 0.9, 0.6];
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', height: 20 }}>
      {bars.map((h, i) => (
        <Box key={i} sx={{
          width: 3, borderRadius: 2, height: `${h * 18}px`,
          background: 'linear-gradient(180deg, #0ea5e9, #8b5cf6)',
          animation: `${waveBar} ${0.8 + i * 0.08}s ease-in-out infinite`,
          animationDelay: `${i * 0.06}s`,
        }} />
      ))}
    </Box>
  );
}

// ── Kente background ────────────────────────────────────────────────────────
function KenteBg() {
  return (
    <Box component="svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"
      sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03, pointerEvents: 'none' }}
    >
      <defs>
        <pattern id="kente-h" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
          <line x1="0" y1="20" x2="40" y2="20" stroke="#8b5cf6" strokeWidth="0.4" />
          <line x1="20" y1="0" x2="20" y2="40" stroke="#8b5cf6" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kente-h)" />
    </Box>
  );
}

// ── Hero ────────────────────────────────────────────────────────────────────
export default function EnhancedHeroSection() {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', background: '#07071a', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <KenteBg />

      {/* Ambient glows */}
      <Box sx={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(14,165,233,0.12) 0%, transparent 65%)', animation: `${pulseGlow} 8s ease-in-out infinite`, pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: '0%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', animation: `${pulseGlow} 10s ease-in-out infinite 3s`, pointerEvents: 'none' }} />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', pt: { xs: 16, md: 10 }, pb: { xs: 10, md: 8 } }}>

        {/* Status badge */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, animation: `${fadeUp} 0.5s ease both` }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1.5,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '50px', px: 2, py: 0.75,
          }}>
            <Wave />
            <Typography sx={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600 }}>
              Africa's leading Voice AI platform
            </Typography>
            <Chip label="New" size="small" sx={{ background: 'linear-gradient(135deg,#0ea5e9,#8b5cf6)', color: '#fff', fontWeight: 800, fontSize: '0.65rem', borderRadius: '50px', height: 20, '& .MuiChip-label': { px: 1.25 } }} />
          </Box>
        </Box>

        {/* Headline */}
        <Typography sx={{
          color: '#f8fafc', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05,
          fontSize: { xs: '3rem', sm: '4rem', md: '5.2rem' },
          mb: 2, animation: `${fadeUp} 0.6s ease 0.1s both`,
        }}>
          Voice AI for{' '}
          <Box component="span" sx={{
            background: 'linear-gradient(135deg, #0ea5e9 20%, #8b5cf6 70%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Africa & Beyond.
          </Box>
        </Typography>

        {/* Subheading */}
        <Typography sx={{
          color: '#64748b', fontSize: { xs: '1.05rem', md: '1.2rem' }, lineHeight: 1.75,
          maxWidth: 560, mx: 'auto', mb: 5,
          animation: `${fadeUp} 0.6s ease 0.2s both`,
        }}>
          Transcribe, translate, synthesize and converse in{' '}
          <Box component="span" sx={{ color: '#cbd5e1', fontWeight: 600 }}>50+ languages</Box>
          {' '}— including Luganda, Swahili, Amharic, Yoruba and more.
        </Typography>

        {/* CTAs */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 7, animation: `${fadeUp} 0.6s ease 0.3s both` }}>
          <Button
            component={Link} to="/get-started"
            variant="contained" size="large" endIcon={<ArrowForward />}
            sx={{
              background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
              color: '#fff', fontWeight: 700, px: 3.5, py: 1.5,
              borderRadius: '50px', fontSize: '1rem',
              boxShadow: '0 6px 28px rgba(14,165,233,0.4)',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 36px rgba(14,165,233,0.55)' },
            }}
          >
            Start Free — No Card Needed
          </Button>
          <Button
            component={Link} to="/documentation"
            variant="outlined" size="large"
            sx={{
              borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)',
              fontWeight: 700, px: 3.5, py: 1.5, borderRadius: '50px', fontSize: '1rem',
              '&:hover': { borderColor: '#8b5cf6', color: '#a78bfa', background: 'rgba(139,92,246,0.07)' },
            }}
          >
            Read the Docs
          </Button>
        </Box>

        {/* Stats */}
        <Box sx={{
          display: 'flex', justifyContent: 'center', gap: { xs: 4, md: 7 }, flexWrap: 'wrap',
          animation: `${fadeUp} 0.6s ease 0.4s both`,
          pt: 5, borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <Stat value={50} suffix="+" label="Languages" />
          <Stat value={10000} suffix="+" label="Users" />
          <Stat value={99.5} suffix="%" label="Uptime" float />
          <Stat value={30} suffix="+" label="Countries" />
        </Box>

        {/* Social proof */}
        <Box sx={{ mt: 5, animation: `${fadeUp} 0.6s ease 0.5s both` }}>
          <Typography sx={{ color: '#374151', fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 2.5 }}>
            Trusted across Africa and beyond
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: { xs: 2.5, md: 4 }, flexWrap: 'wrap' }}>
            {[
              { n: 'Safaricom', c: '#10b981' }, { n: 'MTN', c: '#f59e0b' }, { n: 'Airtel', c: '#ef4444' },
              { n: 'UNHCR', c: '#0ea5e9' }, { n: 'Google', c: '#0ea5e9' }, { n: 'Microsoft', c: '#8b5cf6' },
            ].map(({ n, c }) => (
              <Typography key={n} sx={{ color: '#374151', fontWeight: 700, fontSize: '0.88rem', letterSpacing: '-0.01em', opacity: 0.6, transition: 'opacity 0.2s ease', '&:hover': { opacity: 1 } }}>
                {n}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

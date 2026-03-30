import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Container, Chip, Grid, Button,
  TextField, InputAdornment, MenuItem, Select, FormControl,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { keyframes } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SearchIcon from '@mui/icons-material/Search';
import { ArrowForward } from '@mui/icons-material';

// ── Animations ────────────────────────────────────────────────────────────
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const pulseGlow = keyframes`
  0%,100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.06); }
`;

// ── Design tokens ─────────────────────────────────────────────────────────
const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
const GOLD = '#f59e0b';
const DARK_BG = '#07071a';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = '1px solid rgba(255,255,255,0.07)';

// ── Kente pattern ─────────────────────────────────────────────────────────
function KentePattern() {
  return (
    <Box component="svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"
      sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none' }}
    >
      <defs>
        <pattern id="kente-lm" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
          <polygon points="20,9 31,20 20,31 9,20" fill="none" stroke="#0ea5e9" strokeWidth="0.7" />
          <line x1="0" y1="20" x2="40" y2="20" stroke="#8b5cf6" strokeWidth="0.4" />
          <line x1="20" y1="0" x2="20" y2="40" stroke="#8b5cf6" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kente-lm)" />
    </Box>
  );
}

// ── Language Data ─────────────────────────────────────────────────────────
const LANGUAGE_DATA = [
  { name: 'English',     code: 'en',  region: 'Global',       flag: '🇺🇸', population: '1.5B',  priority: 'high'   },
  { name: 'Luganda',     code: 'lg',  region: 'Uganda',       flag: '🇺🇬', population: '8M',    priority: 'high'   },
  { name: 'Runyankole',  code: 'nyn', region: 'Uganda',       flag: '🇺🇬', population: '3M',    priority: 'medium' },
  { name: 'Acholi',      code: 'ac',  region: 'Uganda',       flag: '🇺🇬', population: '1.5M',  priority: 'medium' },
  { name: 'Ateso',       code: 'at',  region: 'Uganda',       flag: '🇺🇬', population: '1.8M',  priority: 'medium' },
  { name: 'French',      code: 'fr',  region: 'Global',       flag: '🇫🇷', population: '280M',  priority: 'high'   },
  { name: 'Lumasaba',    code: 'myx', region: 'Uganda',       flag: '🇺🇬', population: '1.2M',  priority: 'low'    },
  { name: 'Lusoga',      code: 'xog', region: 'Uganda',       flag: '🇺🇬', population: '2M',    priority: 'medium' },
  { name: 'Swahili',     code: 'sw',  region: 'East Africa',  flag: '🇹🇿', population: '200M',  priority: 'high'   },
  { name: 'Kinyarwanda', code: 'rw',  region: 'Rwanda',       flag: '🇷🇼', population: '12M',   priority: 'medium' },
  { name: 'Lugbara',     code: 'lgg', region: 'Uganda',       flag: '🇺🇬', population: '1M',    priority: 'low'    },
  { name: 'Arabic',      code: 'ar',  region: 'Middle East',  flag: '🇸🇦', population: '400M',  priority: 'high'   },
  { name: 'Spanish',     code: 'es',  region: 'Global',       flag: '🇪🇸', population: '500M',  priority: 'high'   },
  { name: 'Portuguese',  code: 'pt',  region: 'Global',       flag: '🇵🇹', population: '260M',  priority: 'medium' },
  { name: 'German',      code: 'de',  region: 'Europe',       flag: '🇩🇪', population: '100M',  priority: 'medium' },
];

const SUPPORT_MATRIX = {
  'Transcription':  ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara', 'Arabic', 'Spanish', 'Portuguese', 'German'],
  'Translation':    ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara', 'Arabic', 'Spanish', 'Portuguese', 'German'],
  'Text to Speech': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'Kinyarwanda', 'Arabic', 'Spanish', 'Portuguese', 'German'],
  'Voice to Voice': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'Kinyarwanda', 'Arabic', 'Spanish', 'Portuguese', 'German'],
  'Summarization':  ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara', 'Arabic', 'Spanish', 'Portuguese', 'German'],
  'AI Agents':      ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'Kinyarwanda', 'Arabic', 'Spanish', 'Portuguese', 'German'],
};

const FEATURES = Object.keys(SUPPORT_MATRIX);
const REGIONS = ['All', ...new Set(LANGUAGE_DATA.map(l => l.region))];

// ── Animated counter ──────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const end = parseInt(target, 10);
          const duration = 1400;
          const step = Math.ceil(end / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(start);
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Stat card ─────────────────────────────────────────────────────────────
function StatCard({ value, suffix, label, color, index }) {
  return (
    <Box sx={{
      background: CARD_BG, border: CARD_BORDER, borderRadius: '20px', p: 3,
      textAlign: 'center', flex: 1, minWidth: 160,
      animation: `${slideUp} 0.6s ease ${index * 0.1}s both`,
      transition: 'all 0.3s ease',
      '&:hover': { transform: 'translateY(-4px)', borderColor: `${color}40`, background: `${color}08` },
    }}>
      <Typography sx={{
        fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em',
        background: `linear-gradient(135deg, ${color}, ${color}aa)`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        lineHeight: 1,
      }}>
        <AnimatedCounter target={value} suffix={suffix} />
      </Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 600, mt: 0.75, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </Typography>
    </Box>
  );
}

// ── Language card ─────────────────────────────────────────────────────────
function LanguageCard({ lang, index }) {
  const supported = FEATURES.filter(f => SUPPORT_MATRIX[f].includes(lang.name));
  const pct = Math.round((supported.length / FEATURES.length) * 100);
  const priorityColor = lang.priority === 'high' ? '#10b981' : lang.priority === 'medium' ? GOLD : '#94a3b8';

  return (
    <Box sx={{
      background: CARD_BG, border: CARD_BORDER, borderRadius: '20px', p: 3,
      animation: `${slideUp} 0.5s ease ${(index % 6) * 0.06 + 0.1}s both`,
      transition: 'all 0.3s ease',
      '&:hover': { transform: 'translateY(-5px)', borderColor: 'rgba(14,165,233,0.25)', boxShadow: '0 20px 48px rgba(14,165,233,0.08)' },
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography sx={{ fontSize: '2rem', lineHeight: 1 }}>{lang.flag}</Typography>
          <Box>
            <Typography sx={{ color: '#f8fafc', fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>{lang.name}</Typography>
            <Typography sx={{ color: '#475569', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{lang.code.toUpperCase()} · {lang.region}</Typography>
          </Box>
        </Box>
        <Chip label={lang.priority} size="small" sx={{
          background: `${priorityColor}18`, color: priorityColor,
          border: `1px solid ${priorityColor}30`, fontWeight: 700, fontSize: '0.7rem',
          borderRadius: '50px', '& .MuiChip-label': { px: 1.5 },
        }} />
      </Box>

      {/* Progress bar */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
          <Typography sx={{ color: '#475569', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Feature coverage</Typography>
          <Typography sx={{ color: '#0ea5e9', fontWeight: 700, fontSize: '0.8rem' }}>{pct}%</Typography>
        </Box>
        <Box sx={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ width: `${pct}%`, height: '100%', background: G, borderRadius: 4, transition: 'width 0.8s ease' }} />
        </Box>
      </Box>

      {/* Supported features */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
        {supported.map(f => (
          <Chip key={f} label={f} size="small" icon={<CheckCircleIcon sx={{ fontSize: '13px !important', color: '#10b981 !important' }} />}
            sx={{ background: 'rgba(16,185,129,0.08)', color: '#94a3b8', border: '1px solid rgba(16,185,129,0.15)', fontSize: '0.68rem', fontWeight: 500, borderRadius: '6px', '& .MuiChip-label': { pl: 0.5 } }} />
        ))}
        {FEATURES.filter(f => !SUPPORT_MATRIX[f].includes(lang.name)).map(f => (
          <Chip key={f} label={f} size="small" icon={<HourglassEmptyIcon sx={{ fontSize: '13px !important', color: `${GOLD} !important` }} />}
            sx={{ background: `rgba(245,158,11,0.05)`, color: '#475569', border: `1px solid rgba(245,158,11,0.12)`, fontSize: '0.68rem', fontWeight: 500, borderRadius: '6px', '& .MuiChip-label': { pl: 0.5 } }} />
        ))}
      </Box>
    </Box>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function LanguageMatrix() {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [view, setView] = useState('cards'); // 'cards' | 'table'

  const filtered = LANGUAGE_DATA.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q) || l.region.toLowerCase().includes(q);
    const matchRegion = region === 'All' || l.region === region;
    return matchSearch && matchRegion;
  });

  return (
    <Box sx={{ background: DARK_BG, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <KentePattern />

      {/* Ambient glows */}
      <Box sx={{ position: 'absolute', top: '5%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)', animation: `${pulseGlow} 8s ease-in-out infinite`, pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', animation: `${pulseGlow} 10s ease-in-out infinite 2s`, pointerEvents: 'none' }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: { xs: 10, md: 14 } }}>

        {/* ── Hero header ────────────────────────────── */}
        <Box sx={{ textAlign: 'center', mb: 8, animation: `${slideUp} 0.6s ease both` }}>
          <Chip label="🌍 Language Coverage" size="small" sx={{
            background: `rgba(245,158,11,0.12)`, border: `1px solid rgba(245,158,11,0.3)`,
            color: GOLD, fontWeight: 700, borderRadius: '50px', mb: 3,
            '& .MuiChip-label': { px: 2 },
          }} />
          <Typography sx={{
            color: '#f8fafc', fontWeight: 800,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            letterSpacing: '-0.03em', lineHeight: 1.1, mb: 2,
          }}>
            Every language.{' '}
            <Box component="span" sx={{ background: G, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Every voice.
            </Box>
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: { xs: '1rem', md: '1.15rem' }, maxWidth: 560, mx: 'auto', lineHeight: 1.7 }}>
            Comprehensive support for African and global languages across all A-Voices AI services.
          </Typography>
        </Box>

        {/* ── Stat cards ─────────────────────────────── */}
        <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', mb: 8, justifyContent: 'center' }}>
          <StatCard value={15} suffix="+" label="Languages" color="#0ea5e9" index={0} />
          <StatCard value={6} suffix="" label="AI Services" color="#8b5cf6" index={1} />
          <StatCard value={95} suffix="%" label="Coverage" color="#10b981" index={2} />
          <StatCard value={30} suffix="+" label="Countries" color={GOLD} index={3} />
        </Box>

        {/* ── Search & filter bar ─────────────────────────── */}
        <Box sx={{
          background: 'rgba(255,255,255,0.03)', border: CARD_BORDER, borderRadius: '20px',
          p: 2.5, mb: 5, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center',
        }}>
          <TextField
            size="small"
            placeholder="Search languages…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#475569', fontSize: 20 }} /></InputAdornment>,
            }}
            sx={{
              flex: 1, minWidth: 200,
              '& .MuiOutlinedInput-root': {
                borderRadius: '50px', color: '#f8fafc',
                background: 'rgba(255,255,255,0.04)',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                '&:hover fieldset': { borderColor: 'rgba(14,165,233,0.3)' },
                '&.Mui-focused fieldset': { borderColor: '#0ea5e9' },
              },
              '& input::placeholder': { color: '#475569' },
            }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={region}
              onChange={e => setRegion(e.target.value)}
              sx={{
                borderRadius: '50px', color: '#f8fafc', background: 'rgba(255,255,255,0.04)',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.08)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(14,165,233,0.3)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0ea5e9' },
                '& .MuiSvgIcon-root': { color: '#64748b' },
              }}
            >
              {REGIONS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </Select>
          </FormControl>

          {/* View toggle */}
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            {['cards', 'table'].map(v => (
              <Chip key={v} label={v === 'cards' ? '⊞ Cards' : '☰ Table'} onClick={() => setView(v)}
                sx={{
                  background: view === v ? G : 'rgba(255,255,255,0.05)',
                  color: view === v ? '#fff' : '#64748b',
                  fontWeight: 700, cursor: 'pointer', borderRadius: '50px',
                  border: `1px solid ${view === v ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                  transition: 'all 0.2s ease',
                  '& .MuiChip-label': { px: 2 },
                }}
              />
            ))}
          </Box>

          <Typography sx={{ color: '#475569', fontSize: '0.82rem', fontWeight: 600, ml: 'auto' }}>
            {filtered.length} language{filtered.length !== 1 ? 's' : ''} found
          </Typography>
        </Box>

        {/* ── Feature legend ─────────────────────────── */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 4 }}>
          {FEATURES.map(f => (
            <Chip key={f} label={f} size="small" sx={{
              background: 'rgba(14,165,233,0.08)', color: '#94a3b8',
              border: '1px solid rgba(14,165,233,0.12)', fontWeight: 600, borderRadius: '6px',
              '& .MuiChip-label': { px: 1.5 },
            }} />
          ))}
        </Box>

        {/* ── Language cards ─────────────────────────── */}
        {view === 'cards' ? (
          <Grid container spacing={2.5}>
            {filtered.map((lang, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={lang.code}>
                <LanguageCard lang={lang} index={i} />
              </Grid>
            ))}
          </Grid>
        ) : (
          /* Table view */
          <Box sx={{ background: CARD_BG, border: CARD_BORDER, borderRadius: '20px', overflow: 'hidden' }}>
            {/* Table head */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: `200px repeat(${FEATURES.length}, 1fr)`,
              background: 'rgba(255,255,255,0.04)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              p: 2,
              overflowX: 'auto',
            }}>
              <Typography sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Language</Typography>
              {FEATURES.map(f => (
                <Typography key={f} sx={{ color: '#0ea5e9', fontWeight: 600, fontSize: '0.78rem', textAlign: 'center', px: 1 }}>{f}</Typography>
              ))}
            </Box>
            {/* Table rows */}
            {filtered.map((lang, i) => (
              <Box key={lang.code} sx={{
                display: 'grid',
                gridTemplateColumns: `200px repeat(${FEATURES.length}, 1fr)`,
                p: 2, overflowX: 'auto',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                transition: 'background 0.2s ease',
                '&:hover': { background: 'rgba(255,255,255,0.02)' },
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography sx={{ fontSize: '1.4rem' }}>{lang.flag}</Typography>
                  <Box>
                    <Typography sx={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.9rem' }}>{lang.name}</Typography>
                    <Typography sx={{ color: '#475569', fontSize: '0.72rem', fontWeight: 600 }}>{lang.region}</Typography>
                  </Box>
                </Box>
                {FEATURES.map(f => {
                  const supported = SUPPORT_MATRIX[f].includes(lang.name);
                  return (
                    <Box key={f} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {supported
                        ? <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                        : <HourglassEmptyIcon sx={{ color: '#374151', fontSize: 18 }} />
                      }
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography sx={{ color: '#475569', fontSize: '1rem', fontWeight: 600 }}>No languages match your filters.</Typography>
            <Button onClick={() => { setSearch(''); setRegion('All'); }} sx={{ mt: 2, color: '#0ea5e9', fontWeight: 700, textTransform: 'none' }}>
              Clear Filters
            </Button>
          </Box>
        )}

        {/* ── Bottom CTA ──────────────────────────────── */}
        <Box sx={{
          mt: 10, textAlign: 'center',
          background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '28px', p: { xs: 5, md: 7 }, position: 'relative', overflow: 'hidden',
        }}>
          <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(14,165,233,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}60, transparent)` }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography sx={{ color: GOLD, fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 2 }}>
              Missing a language?
            </Typography>
            <Typography sx={{ color: '#f8fafc', fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.4rem' }, letterSpacing: '-0.02em', mb: 2 }}>
              We're always expanding coverage.
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '1rem', mb: 4, maxWidth: 400, mx: 'auto' }}>
              New languages are added monthly. Start for free and grow with us.
            </Typography>
            <Button component={Link} to="/get-started" variant="contained" endIcon={<ArrowForward />}
              sx={{
                background: G, color: '#fff', fontWeight: 700, px: 4, py: 1.5, borderRadius: '50px',
                boxShadow: '0 6px 28px rgba(14,165,233,0.4)',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 36px rgba(14,165,233,0.55)' },
              }}
            >
              Get Started Free
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
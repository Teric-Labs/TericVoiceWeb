import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Stack, Chip, TextField, InputAdornment, Grid,
  Tooltip, Table, TableBody, TableCell, TableHead, TableRow,
  Button, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import {
  Search, CheckCircle, RemoveCircleOutline, GridView, TableRows,
  Language as LanguageIcon, ArrowForward, Schedule,
} from '@mui/icons-material';
import { AC, GLASS } from '../../utils/mediaVault';
import { AvoicesProgress } from '../progress';
import {
  PLATFORM_LANGUAGES, STUDIO_FEATURES, COMING_SOON_LANGUAGES,
  getFeatureSupportForLanguage, LANGUAGE_STATS,
} from '../../constants/languageSupport';

const G = 'linear-gradient(135deg, #E8A020, #C47F10)';

function FeatureSupportBar({ langCode }) {
  const supported = getFeatureSupportForLanguage(langCode);
  const pct = Math.round((supported.length / STUDIO_FEATURES.length) * 100);
  return (
    <Box sx={{ minWidth: 100 }}>
      <AvoicesProgress variant="determinate" value={pct} size="sm" showValue label="Coverage" />
    </Box>
  );
}

function LanguageRowCard({ lang, onOpenStudio }) {
  const features = getFeatureSupportForLanguage(lang.code);
  return (
    <Box
      sx={{
        ...GLASS, p: 2.5, borderRadius: '16px', height: '100%',
        transition: 'all 0.2s ease',
        '&:hover': { borderColor: `${AC}40`, boxShadow: `0 12px 32px ${AC}12` },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2 }}>
        <Typography sx={{ fontSize: '2rem', lineHeight: 1 }}>{lang.flag}</Typography>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#111' }}>{lang.name}</Typography>
          <Typography variant="caption" sx={{ color: 'rgba(17,17,17,0.45)', fontWeight: 600 }}>
            {lang.code.toUpperCase()} · {lang.region}
          </Typography>
        </Box>
        <Chip
          label={lang.tier === 'flagship' ? 'Flagship' : lang.neuralVoice ? 'Neural' : 'Core'}
          size="small"
          sx={{
            height: 22, fontSize: '0.65rem', fontWeight: 800,
            bgcolor: lang.tier === 'flagship' ? 'rgba(232,160,32,0.15)' : 'rgba(17,17,17,0.05)',
            color: lang.tier === 'flagship' ? AC : 'rgba(17,17,17,0.55)',
          }}
        />
      </Stack>
      <FeatureSupportBar langCode={lang.code} />
      <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 2 }}>
        {features.slice(0, 4).map(f => (
          <Chip key={f.id} label={f.label} size="small" sx={{ height: 20, fontSize: '0.62rem', fontWeight: 600 }} />
        ))}
        {features.length > 4 && (
          <Chip label={`+${features.length - 4}`} size="small" sx={{ height: 20, fontSize: '0.62rem' }} />
        )}
      </Stack>
      {lang.neuralVoice && (
        <Button
          size="small"
          endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
          onClick={() => onOpenStudio('/dashboard/synthesize')}
          sx={{ mt: 2, fontWeight: 700, textTransform: 'none', color: AC, fontSize: '0.78rem' }}
        >
          Try in Synthesis Studio
        </Button>
      )}
    </Box>
  );
}

export default function LanguageCatalog({ variant = 'dashboard', hidePublicHero = false }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [view, setView] = useState('cards');
  const [featureFilter, setFeatureFilter] = useState('all');

  const regions = useMemo(() => ['All', ...new Set(PLATFORM_LANGUAGES.map(l => l.region))].sort(), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PLATFORM_LANGUAGES.filter(lang => {
      const matchQ = !q || lang.name.toLowerCase().includes(q) || lang.code.includes(q) || lang.region.toLowerCase().includes(q);
      const matchRegion = region === 'All' || lang.region === region;
      const matchFeat = featureFilter === 'all' || getFeatureSupportForLanguage(lang.code).some(f => f.id === featureFilter);
      return matchQ && matchRegion && matchFeat;
    });
  }, [search, region, featureFilter]);

  const isPublic = variant === 'public';

  return (
    <Box sx={{ width: '100%' }}>
      {isPublic && !hidePublicHero && (
        <Box sx={{ textAlign: 'center', py: { xs: 4, md: 6 }, px: 2 }}>
          <Chip
            icon={<LanguageIcon sx={{ fontSize: '16px !important' }} />}
            label="Language coverage"
            sx={{ mb: 2, fontWeight: 700, bgcolor: 'rgba(232,160,32,0.1)', color: AC, border: `1px solid ${AC}35` }}
          />
          <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.85rem', md: '2.6rem' }, letterSpacing: '-0.03em', color: '#111', mb: 1 }}>
            Built for African languages. Ready for the world.
          </Typography>
          <Typography sx={{ color: 'rgba(17,17,17,0.5)', maxWidth: 560, mx: 'auto', lineHeight: 1.65 }}>
            {LANGUAGE_STATS.totalLanguages}+ languages across {LANGUAGE_STATS.studioFeatures} production studios — with {LANGUAGE_STATS.neuralVoices} neural voice locales.
          </Typography>
        </Box>
      )}

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3, px: isPublic ? 2 : 0 }}>
        {[
          { label: 'Languages', value: LANGUAGE_STATS.totalLanguages },
          { label: 'Studio tools', value: LANGUAGE_STATS.studioFeatures },
          { label: 'Neural voices', value: LANGUAGE_STATS.neuralVoices },
          { label: 'On roadmap', value: LANGUAGE_STATS.comingSoon },
        ].map(stat => (
          <Grid item xs={6} md={3} key={stat.label}>
            <Box sx={{ ...GLASS, p: 2, borderRadius: '14px', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 900, fontSize: '1.75rem', color: '#111', lineHeight: 1 }}>{stat.value}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'rgba(17,17,17,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {stat.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Studio feature matrix */}
      <Box sx={{ ...GLASS, borderRadius: '20px', p: { xs: 2, md: 3 }, mb: 3 }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1rem', mb: 0.5 }}>Studio language support</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: 640 }}>
          Each tool lists how many platform languages it supports. Open a studio to start in your locale.
        </Typography>
        <Grid container spacing={1.5}>
          {STUDIO_FEATURES.map(feat => {
            const count = PLATFORM_LANGUAGES.filter(l => feat.langCodes.includes(l.code)).length;
            return (
              <Grid item xs={12} sm={6} md={4} key={feat.id}>
                <Box
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(feat.path)}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate(feat.path)}
                  sx={{
                    p: 2, borderRadius: '12px', cursor: 'pointer',
                    border: '1px solid rgba(17,17,17,0.07)',
                    bgcolor: 'rgba(17,17,17,0.02)',
                    transition: 'all 0.15s ease',
                    '&:hover': { borderColor: `${AC}40`, bgcolor: 'rgba(232,160,32,0.04)' },
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.75 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: '#111' }}>{feat.label}</Typography>
                    {feat.badge && (
                      <Chip label={feat.badge} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800, bgcolor: `${AC}20`, color: AC }} />
                    )}
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, lineHeight: 1.4 }}>
                    {feat.description}
                  </Typography>
                  <Chip label={`${count} languages`} size="small" sx={{ fontWeight: 700, fontSize: '0.7rem', height: 22 }} />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Filters */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'stretch', md: 'center' }}
        sx={{ ...GLASS, p: 2, borderRadius: '16px', mb: 2 }}
      >
        <TextField
          size="small"
          fullWidth
          placeholder="Search by name, code, or region…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment>,
          }}
          sx={{ flex: 1 }}
        />
        <TextField
          select
          size="small"
          label="Region"
          value={region}
          onChange={e => setRegion(e.target.value)}
          SelectProps={{ native: true }}
          sx={{ minWidth: 140 }}
        >
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </TextField>
        <TextField
          select
          size="small"
          label="Studio tool"
          value={featureFilter}
          onChange={e => setFeatureFilter(e.target.value)}
          SelectProps={{ native: true }}
          sx={{ minWidth: 160 }}
        >
          <option value="all">All tools</option>
          {STUDIO_FEATURES.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
        </TextField>
        <ToggleButtonGroup size="small" value={view} exclusive onChange={(_, v) => v && setView(v)}>
          <ToggleButton value="cards"><GridView fontSize="small" /></ToggleButton>
          <ToggleButton value="matrix"><TableRows fontSize="small" /></ToggleButton>
        </ToggleButtonGroup>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, whiteSpace: 'nowrap' }}>
          {filtered.length} shown
        </Typography>
      </Stack>

      {/* Catalog */}
      {view === 'cards' ? (
        <Grid container spacing={2}>
          {filtered.map(lang => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={lang.code}>
              <LanguageRowCard lang={lang} onOpenStudio={navigate} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ ...GLASS, borderRadius: '16px', overflow: 'auto' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, fontSize: '0.7rem', bgcolor: '#fafaf9' }}>Language</TableCell>
                {STUDIO_FEATURES.map(f => (
                  <TableCell key={f.id} align="center" sx={{ fontWeight: 700, fontSize: '0.65rem', bgcolor: '#fafaf9', minWidth: 72 }}>
                    <Tooltip title={f.description}><span>{f.label.split(' ')[0]}</span></Tooltip>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(lang => (
                <TableRow key={lang.code} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography sx={{ fontSize: '1.25rem' }}>{lang.flag}</Typography>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{lang.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{lang.code.toUpperCase()}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  {STUDIO_FEATURES.map(f => {
                    const ok = f.langCodes.includes(lang.code);
                    return (
                      <TableCell key={f.id} align="center">
                        {ok
                          ? <CheckCircle sx={{ fontSize: 18, color: '#059669' }} />
                          : <RemoveCircleOutline sx={{ fontSize: 18, color: 'rgba(17,17,17,0.15)' }} />}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {filtered.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography color="text.secondary" fontWeight={600}>No languages match your filters.</Typography>
          <Button size="small" onClick={() => { setSearch(''); setRegion('All'); setFeatureFilter('all'); }} sx={{ mt: 1, fontWeight: 700, color: AC }}>
            Clear filters
          </Button>
        </Box>
      )}

      {/* Coming soon */}
      <Box sx={{ ...GLASS, borderRadius: '20px', p: { xs: 2, md: 3 }, mt: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Schedule sx={{ color: AC }} />
          <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>Roadmap</Typography>
        </Stack>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {COMING_SOON_LANGUAGES.map(l => (
            <Chip
              key={l.code}
              label={`${l.name} (${l.region})`}
              icon={<Schedule sx={{ fontSize: '14px !important' }} />}
              variant="outlined"
              sx={{ fontWeight: 600, borderColor: 'rgba(17,17,17,0.12)' }}
            />
          ))}
        </Stack>
      </Box>

      {/* CTA */}
      <Box sx={{ textAlign: 'center', mt: 4, p: 3, ...GLASS, borderRadius: '20px' }}>
        <Typography sx={{ fontWeight: 800, mb: 1 }}>Need another language?</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 480, mx: 'auto' }}>
          Tell us which locale you need — we prioritize African languages requested by production teams.
        </Typography>
        <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            onClick={() => navigate(isPublic ? '/get-started' : '/dashboard/contact-support')}
            sx={{ background: G, color: '#111', fontWeight: 800, borderRadius: '12px', textTransform: 'none' }}
          >
            {isPublic ? 'Get started' : 'Request a language'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(isPublic ? '/documentation' : '/dashboard/api-reference')}
            sx={{ borderColor: `${AC}50`, color: AC, fontWeight: 700, borderRadius: '12px', textTransform: 'none' }}
          >
            API reference
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

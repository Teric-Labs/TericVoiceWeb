import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Box, Typography, Stack, Chip, TextField, InputAdornment, IconButton,
  Tooltip, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Tab,
  Drawer, useMediaQuery, useTheme,   Divider, Alert,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Search, ContentCopy, Menu as MenuIcon, Check,
  Lock, Terminal, ChevronRight,
} from '@mui/icons-material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
  API_GROUPS, API_VERSION, API_DOCS_TITLE, getApiBaseUrl,
  HTTP_STATUS_DOCS, AUTH_DOCS,
} from '../../data/apiReferenceSpec';
import { buildSnippets } from '../../utils/apiReferenceSnippets';
import { AC, GLASS } from '../../utils/mediaVault';
import MarketingPageHeader from '../marketing/MarketingPageHeader';

const METHOD_STYLES = {
  GET: { bg: 'rgba(16, 185, 129, 0.12)', color: '#059669', border: 'rgba(16, 185, 129, 0.35)' },
  POST: { bg: 'rgba(59, 130, 246, 0.12)', color: '#2563eb', border: 'rgba(59, 130, 246, 0.35)' },
  PUT: { bg: 'rgba(232, 160, 32, 0.12)', color: '#b45309', border: 'rgba(232, 160, 32, 0.35)' },
  DELETE: { bg: 'rgba(239, 68, 68, 0.12)', color: '#dc2626', border: 'rgba(239, 68, 68, 0.35)' },
  WS: { bg: 'rgba(139, 92, 246, 0.12)', color: '#7c3aed', border: 'rgba(139, 92, 246, 0.35)' },
};

function MethodBadge({ method }) {
  const s = METHOD_STYLES[method] || METHOD_STYLES.POST;
  return (
    <Chip
      label={method}
      size="small"
      sx={{
        fontWeight: 800, fontSize: '0.68rem', height: 22, minWidth: 52,
        bgcolor: s.bg, color: s.color, border: `1px solid ${s.border}`,
        fontFamily: 'ui-monospace, monospace',
      }}
    />
  );
}

function CopyButton({ text, label = 'Copy' }) {
  const [ok, setOk] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setOk(true);
      setTimeout(() => setOk(false), 2000);
    });
  };
  return (
    <Tooltip title={ok ? 'Copied' : label}>
      <IconButton size="small" onClick={copy} sx={{ color: ok ? '#059669' : 'rgba(17,17,17,0.4)' }}>
        {ok ? <Check sx={{ fontSize: 16 }} /> : <ContentCopy sx={{ fontSize: 16 }} />}
      </IconButton>
    </Tooltip>
  );
}

function CodePanel({ endpoint }) {
  const [tab, setTab] = useState(0);
  const langs = ['curl', 'python', 'javascript'];
  const labels = ['cURL', 'Python', 'JavaScript'];
  const snippets = useMemo(() => buildSnippets(endpoint), [endpoint]);

  return (
    <Box sx={{ mt: 2, borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(17,17,17,0.08)' }}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          minHeight: 40, bgcolor: 'rgba(17,17,17,0.03)',
          borderBottom: '1px solid rgba(17,17,17,0.06)',
          '& .MuiTab-root': { minHeight: 40, fontWeight: 700, fontSize: '0.72rem', textTransform: 'none' },
          '& .Mui-selected': { color: AC },
          '& .MuiTabs-indicator': { bgcolor: AC },
        }}
      >
        {labels.map(l => <Tab key={l} label={l} />)}
      </Tabs>
      <Box sx={{ position: 'relative', '& pre': { margin: 0, fontSize: '0.78rem !important' } }}>
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
          <CopyButton text={snippets[langs[tab]]} />
        </Box>
        <SyntaxHighlighter language={langs[tab] === 'curl' ? 'bash' : langs[tab]} style={atomOneLight} customStyle={{ padding: '16px 16px 20px', background: '#fafaf9' }}>
          {snippets[langs[tab]]}
        </SyntaxHighlighter>
      </Box>
    </Box>
  );
}

function ParamsTable({ parameters }) {
  if (!parameters?.length) {
    return <Typography variant="body2" color="text.secondary">No parameters.</Typography>;
  }
  return (
    <Table size="small" sx={{ '& th': { fontWeight: 700, fontSize: '0.7rem', color: 'rgba(17,17,17,0.45)', textTransform: 'uppercase' } }}>
      <TableHead>
        <TableRow>
          <TableCell>Parameter</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Required</TableCell>
          <TableCell>Description</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {parameters.map(p => (
          <TableRow key={p.name} sx={{ '& td': { borderColor: 'rgba(17,17,17,0.05)', verticalAlign: 'top' } }}>
            <TableCell>
              <Typography component="code" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 700, color: '#111' }}>
                {p.name}
              </Typography>
            </TableCell>
            <TableCell><Chip label={p.type} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} /></TableCell>
            <TableCell>
              <Chip label={p.required ? 'Yes' : 'No'} size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: p.required ? 'rgba(232,160,32,0.12)' : 'rgba(17,17,17,0.04)' }} />
            </TableCell>
            <TableCell><Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem', lineHeight: 1.5 }}>{p.description}</Typography></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function EndpointCard({ endpoint }) {
  const anchor = `endpoint-${endpoint.id}`;
  return (
    <Box
      id={anchor}
      sx={{
        scrollMarginTop: 88,
        py: 3,
        borderBottom: '1px solid rgba(17,17,17,0.06)',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" sx={{ mb: 1 }}>
        <MethodBadge method={endpoint.method} />
        <Typography
          component="code"
          sx={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: { xs: '0.82rem', md: '0.92rem' },
            fontWeight: 600,
            color: '#111',
            bgcolor: 'rgba(17,17,17,0.04)',
            px: 1.5, py: 0.5, borderRadius: '8px',
            border: '1px solid rgba(17,17,17,0.08)',
          }}
        >
          {endpoint.path}
        </Typography>
      </Stack>
      <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#111', mb: 0.75 }}>
        {endpoint.summary}
      </Typography>
      {endpoint.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.65, maxWidth: 720 }}>
          {endpoint.description}
        </Typography>
      )}
      {endpoint.contentType && (
        <Typography variant="caption" sx={{ display: 'block', mb: 2, color: 'rgba(17,17,17,0.45)', fontWeight: 600 }}>
          Content-Type: <Box component="span" sx={{ fontFamily: 'monospace' }}>{endpoint.contentType}</Box>
        </Typography>
      )}

      <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(17,17,17,0.4)', mb: 1 }}>
        Parameters
      </Typography>
      <ParamsTable parameters={endpoint.parameters} />

      {endpoint.responseExample && (
        <Box sx={{ mt: 2.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(17,17,17,0.4)', mb: 1 }}>
            Response
          </Typography>
          <Box sx={{ position: 'relative', borderRadius: '10px', border: '1px solid rgba(17,17,17,0.08)', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: 6, right: 6 }}><CopyButton text={endpoint.responseExample} /></Box>
            <SyntaxHighlighter language="json" style={atomOneLight} customStyle={{ margin: 0, padding: '14px 16px', fontSize: '0.78rem', background: '#fafaf9' }}>
              {endpoint.responseExample}
            </SyntaxHighlighter>
          </Box>
        </Box>
      )}

      {endpoint.notes?.map(note => (
        <Alert key={note} severity="info" sx={{ mt: 2, borderRadius: '10px', fontSize: '0.82rem' }}>{note}</Alert>
      ))}

      <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(17,17,17,0.4)', mt: 2.5, mb: 0 }}>
        Request example
      </Typography>
      <CodePanel endpoint={endpoint} />
    </Box>
  );
}

function NavList({ groups, activeId, onSelect }) {
  return (
    <Stack spacing={0.5} sx={{ py: 1 }}>
      <Typography sx={{ px: 1.5, py: 1, fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(17,17,17,0.35)' }}>
        Reference
      </Typography>
      <Box
        component="button"
        type="button"
        onClick={() => onSelect('overview')}
        sx={{
          display: 'block', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
          px: 1.5, py: 1, borderRadius: '8px', fontWeight: activeId === 'overview' ? 800 : 600,
          fontSize: '0.82rem', bgcolor: activeId === 'overview' ? 'rgba(232,160,32,0.1)' : 'transparent',
          color: activeId === 'overview' ? '#111' : 'rgba(17,17,17,0.55)',
          '&:hover': { bgcolor: 'rgba(232,160,32,0.06)' },
        }}
      >
        Overview
      </Box>
      <Box
        component="button"
        type="button"
        onClick={() => onSelect('authentication')}
        sx={{
          display: 'block', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
          px: 1.5, py: 1, borderRadius: '8px', fontWeight: activeId === 'authentication' ? 800 : 600,
          fontSize: '0.82rem', bgcolor: activeId === 'authentication' ? 'rgba(232,160,32,0.1)' : 'transparent',
          color: activeId === 'authentication' ? '#111' : 'rgba(17,17,17,0.55)',
          '&:hover': { bgcolor: 'rgba(232,160,32,0.06)' },
        }}
      >
        Authentication
      </Box>
      <Box
        component="button"
        type="button"
        onClick={() => onSelect('errors')}
        sx={{
          display: 'block', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
          px: 1.5, py: 1, borderRadius: '8px', fontWeight: activeId === 'errors' ? 800 : 600,
          fontSize: '0.82rem', bgcolor: activeId === 'errors' ? 'rgba(232,160,32,0.1)' : 'transparent',
          color: activeId === 'errors' ? '#111' : 'rgba(17,17,17,0.55)',
          '&:hover': { bgcolor: 'rgba(232,160,32,0.06)' },
        }}
      >
        Errors
      </Box>
      <Divider sx={{ my: 1, opacity: 0.08 }} />
      {groups.map(group => (
        <Box key={group.id} sx={{ mb: 1 }}>
          <Typography sx={{ px: 1.5, py: 0.5, fontWeight: 800, fontSize: '0.68rem', color: AC, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {group.title}
          </Typography>
          {group.endpoints.map(ep => (
            <Box
              key={ep.id}
              component="button"
              type="button"
              onClick={() => onSelect(`endpoint-${ep.id}`)}
              sx={{
                display: 'flex', alignItems: 'center', gap: 0.75, width: '100%', textAlign: 'left',
                border: 'none', cursor: 'pointer', px: 1.5, py: 0.65, borderRadius: '8px',
                fontWeight: activeId === `endpoint-${ep.id}` ? 700 : 500,
                fontSize: '0.78rem', fontFamily: 'monospace',
                bgcolor: activeId === `endpoint-${ep.id}` ? 'rgba(232,160,32,0.1)' : 'transparent',
                color: activeId === `endpoint-${ep.id}` ? '#111' : 'rgba(17,17,17,0.5)',
                '&:hover': { bgcolor: 'rgba(232,160,32,0.06)' },
              }}
            >
              <ChevronRight sx={{ fontSize: 14, opacity: 0.4 }} />
              <Box component="span" sx={{ color: METHOD_STYLES[ep.method]?.color || '#2563eb', fontWeight: 800, fontSize: '0.65rem', minWidth: 36 }}>
                {ep.method}
              </Box>
              <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {ep.path}
              </Box>
            </Box>
          ))}
        </Box>
      ))}
    </Stack>
  );
}

export default function ApiReferenceDocs({ showHero = false }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [search, setSearch] = useState('');
  const [navOpen, setNavOpen] = useState(false);
  const [activeId, setActiveId] = useState('overview');
  const baseUrl = getApiBaseUrl();

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return API_GROUPS;
    return API_GROUPS.map(g => ({
      ...g,
      endpoints: g.endpoints.filter(ep =>
        ep.path.toLowerCase().includes(q)
        || ep.summary.toLowerCase().includes(q)
        || ep.method.toLowerCase().includes(q)
        || (ep.description || '').toLowerCase().includes(q)
      ),
    })).filter(g => g.endpoints.length > 0);
  }, [search]);

  const scrollTo = useCallback((id) => {
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (!isDesktop) setNavOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    const ids = ['overview', 'authentication', 'errors', ...API_GROUPS.flatMap(g => g.endpoints.map(e => `endpoint-${e.id}`))];
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.25, 0.5] }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [filteredGroups]);

  return (
    <Box sx={{ width: '100%', pb: 6 }}>
      {showHero && (
        <MarketingPageHeader
          chip={`API v${API_VERSION}`}
          title={API_DOCS_TITLE}
          subtitle="REST reference for translation, transcription, speech synthesis, and media production."
          pt={{ xs: 10, md: 12 }}
          pb={3}
        />
      )}

      <Box sx={{ display: 'flex', gap: 0, alignItems: 'flex-start', maxWidth: 1400, mx: 'auto', px: { xs: 1, md: 2 } }}>
        {isDesktop && (
          <Box
            sx={{
              width: 260, flexShrink: 0, position: 'sticky', top: 80, alignSelf: 'flex-start',
              maxHeight: 'calc(100vh - 96px)', overflowY: 'auto',
              ...GLASS, mr: 2, borderRadius: '16px',
            }}
          >
            <Box sx={{ p: 1.5, borderBottom: '1px solid rgba(17,17,17,0.06)' }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Search endpoints…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment>,
                  sx: { borderRadius: '10px', fontSize: '0.85rem' },
                }}
              />
            </Box>
            <NavList groups={filteredGroups} activeId={activeId} onSelect={scrollTo} />
          </Box>
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {!isDesktop && (
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Search endpoints…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18 }} /></InputAdornment>,
                }}
              />
              <IconButton onClick={() => setNavOpen(true)} sx={{ border: '1px solid rgba(17,17,17,0.1)', borderRadius: '10px' }}>
                <MenuIcon />
              </IconButton>
            </Stack>
          )}

          <Drawer anchor="left" open={navOpen} onClose={() => setNavOpen(false)} PaperProps={{ sx: { width: 280 } }}>
            <NavList groups={filteredGroups} activeId={activeId} onSelect={scrollTo} />
          </Drawer>

          <Box sx={{ ...GLASS, borderRadius: '20px', overflow: 'hidden' }}>
            {/* Overview */}
            <Box id="overview" sx={{ scrollMarginTop: 88, p: { xs: 2.5, md: 4 }, borderBottom: '1px solid rgba(17,17,17,0.06)' }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Terminal sx={{ color: AC }} />
                <Typography sx={{ fontWeight: 900, fontSize: '1.35rem', color: '#111' }}>Overview</Typography>
                <Chip label={`v${API_VERSION}`} size="small" sx={{ fontWeight: 700, fontSize: '0.65rem' }} />
              </Stack>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7, maxWidth: 720 }}>
                The Avoices API is a REST service for multilingual AI media workflows: speech recognition, translation,
                text-to-speech, summarization, video dubbing, and library management. All production traffic uses HTTPS
                and JSON or multipart form bodies unless noted otherwise.
              </Typography>

              <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(17,17,17,0.4)', mb: 1 }}>
                Base URL
              </Typography>
              <Stack direction="row" alignItems="center" sx={{
                bgcolor: 'rgba(17,17,17,0.04)', border: '1px solid rgba(17,17,17,0.08)',
                borderRadius: '10px', px: 2, py: 1.25, mb: 3,
              }}>
                <Typography component="code" sx={{ flex: 1, fontFamily: 'monospace', fontSize: '0.88rem', fontWeight: 600 }}>
                  {baseUrl}
                </Typography>
                <CopyButton text={baseUrl} label="Copy base URL" />
              </Stack>

              <Stack direction="row" flexWrap="wrap" gap={1}>
                {['REST', 'multipart/form-data', 'JSON', 'Credit-based billing', 'Background jobs'].map(t => (
                  <Chip key={t} label={t} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.72rem' }} />
                ))}
              </Stack>
            </Box>

            {/* Authentication */}
            <Box id="authentication" sx={{ scrollMarginTop: 88, p: { xs: 2.5, md: 4 }, borderBottom: '1px solid rgba(17,17,17,0.06)' }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Lock sx={{ color: AC }} />
                <Typography sx={{ fontWeight: 900, fontSize: '1.2rem' }}>{AUTH_DOCS.title}</Typography>
              </Stack>
              {AUTH_DOCS.paragraphs.map(p => (
                <Typography key={p} variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.7, maxWidth: 720 }}>{p}</Typography>
              ))}
              <Box sx={{ mt: 2, p: 2, borderRadius: '12px', bgcolor: 'rgba(232,160,32,0.06)', border: `1px solid ${AC}25` }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
                  user_id=YOUR_USER_ID  <Typography component="span" color="text.secondary">// form field or JSON body</Typography>
                </Typography>
              </Box>
            </Box>

            {/* Endpoint groups */}
            {filteredGroups.map(group => (
              <Box key={group.id} id={`group-${group.id}`} sx={{ scrollMarginTop: 88 }}>
                <Box sx={{ px: { xs: 2.5, md: 4 }, pt: 3, pb: 1, bgcolor: 'rgba(232,160,32,0.03)', borderBottom: '1px solid rgba(17,17,17,0.05)' }}>
                  <Typography sx={{ fontWeight: 900, fontSize: '1.15rem', color: '#111' }}>{group.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{group.description}</Typography>
                </Box>
                <Box sx={{ px: { xs: 2.5, md: 4 } }}>
                  {group.endpoints.map(ep => (
                    <EndpointCard key={ep.id} endpoint={ep} />
                  ))}
                </Box>
              </Box>
            ))}

            {filteredGroups.length === 0 && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No endpoints match &quot;{search}&quot;</Typography>
              </Box>
            )}

            {/* Errors */}
            <Box id="errors" sx={{ scrollMarginTop: 88, p: { xs: 2.5, md: 4 } }}>
              <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', mb: 2 }}>HTTP status codes</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {HTTP_STATUS_DOCS.map(row => (
                    <TableRow key={row.code}>
                      <TableCell><Chip label={row.code} size="small" sx={{ fontWeight: 800, fontFamily: 'monospace' }} /></TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{row.label}</TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{row.description}</Typography></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                Need help integrating?{' '}
                <Link to="/dashboard/contact-support" style={{ color: AC, fontWeight: 700 }}>Contact support</Link>
                {' '}or open the studio apps to inspect live request payloads in your browser network tab.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

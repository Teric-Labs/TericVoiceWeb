import React from 'react';
import { Box, Typography, Button, Container, Grid, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { keyframes } from '@mui/material/styles';
import {
  Translate, Mic, RecordVoiceOver, GraphicEq,
  Summarize, Chat, Code, ArrowForward, CheckCircle,
} from '@mui/icons-material';

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ── Shared tokens ──────────────────────────────────────────────────────────
const G = 'linear-gradient(135deg, #0ea5e9, #8b5cf6)';
const GOLD = '#f59e0b';

// ── Feature grid data ──────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <Translate sx={{ fontSize: 28 }} />,
    title: 'Text Translation',
    desc: 'Real-time translation across 50+ African and global languages with 99%+ accuracy.',
    color: '#0ea5e9', glow: 'rgba(14,165,233,0.2)',
  },
  {
    icon: <Mic sx={{ fontSize: 28 }} />,
    title: 'Voice Recognition',
    desc: 'State-of-the-art ASR trained natively on African speech patterns and accents.',
    color: '#8b5cf6', glow: 'rgba(139,92,246,0.2)',
  },
  {
    icon: <RecordVoiceOver sx={{ fontSize: 28 }} />,
    title: 'Text to Speech',
    desc: 'Natural, expressive voices that sound human in African languages and dialects.',
    color: '#10b981', glow: 'rgba(16,185,129,0.2)',
  },
  {
    icon: <GraphicEq sx={{ fontSize: 28 }} />,
    title: 'Voice to Voice',
    desc: 'Speak in one language, be heard in another — live, with zero latency.',
    color: '#f59e0b', glow: 'rgba(245,158,11,0.2)',
  },
  {
    icon: <Summarize sx={{ fontSize: 28 }} />,
    title: 'AI Summarization',
    desc: 'Condense hours of audio or pages of text into clear, actionable summaries.',
    color: '#ef4444', glow: 'rgba(239,68,68,0.2)',
  },
  {
    icon: <Chat sx={{ fontSize: 28 }} />,
    title: 'AI Agents',
    desc: 'Deploy conversational AI assistants fluent in Luganda, Swahili, Yoruba and more.',
    color: '#8b5cf6', glow: 'rgba(139,92,246,0.2)',
  },
  {
    icon: <Code sx={{ fontSize: 28 }} />,
    title: 'Developer API',
    desc: 'REST API with SDKs, webhooks, and battle-tested uptime for production apps.',
    color: '#0ea5e9', glow: 'rgba(14,165,233,0.2)',
  },
];

// ── Showcase sections ──────────────────────────────────────────────────────
const SHOWCASES = [
  {
    tag: 'Voice Recognition',
    tagColor: '#0ea5e9',
    headline: 'The only ASR built for African languages first',
    body: 'Most speech AI fails on African accents. Ours was trained from the ground up on native African speech — delivering industry-leading accuracy for Luganda, Swahili, Amharic, Yoruba, and 45+ more.',
    bullets: ['Native accent models', 'Real-time & batch processing', 'Speaker diarization', '< 300ms latency'],
    cta: 'Try Voice Recognition',
    ctaPath: '/get-started',
    visual: { panel: WaveformPanel },
    reverse: false,
  },
  {
    tag: 'AI Agents',
    tagColor: '#8b5cf6',
    headline: 'Ship African-language AI assistants in days',
    body: "Give your customers a voice in their mother tongue. Our chatbot engine handles context, cultural nuance, and code-switching between languages seamlessly — no ML team required.",
    bullets: ['No-code bot builder', 'Multi-turn conversations', 'API + webhook support', 'WhatsApp & web widgets'],
    cta: 'Build Your Chatbot',
    ctaPath: '/get-started',
    visual: { panel: AgentPanel },
    reverse: true,
  },
  {
    tag: 'Developer API',
    tagColor: GOLD,
    headline: 'One API. Every African language.',
    body: "Integrate voice AI into your product in under an hour. Our REST API is designed for simplicity, scalability, and reliability — with generous free tiers and pay-as-you-grow pricing.",
    bullets: ['Simple REST endpoints', 'Python & JS SDKs', '99.9% SLA uptime', 'Global CDN delivery'],
    cta: 'Read the Docs',
    ctaPath: '/documentation',
    visual: { panel: ApiPanel },
    reverse: false,
  },
];

// ── Feature card ───────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, color, glow }) {
  return (
    <Box sx={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '20px', p: 3,
      transition: 'all 0.3s ease',
      cursor: 'default',
      '&:hover': {
        background: `rgba(${color === '#0ea5e9' ? '14,165,233' : color === '#8b5cf6' ? '139,92,246' : color === '#10b981' ? '16,185,129' : color === '#f59e0b' ? '245,158,11' : '239,68,68'},0.06)`,
        border: `1px solid ${color}30`,
        transform: 'translateY(-4px)',
        boxShadow: `0 16px 40px ${glow}`,
      },
    }}>
      <Box sx={{
        width: 56, height: 56, borderRadius: '14px',
        background: `${glow}`,
        border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        mb: 2.5, color,
      }}>
        {icon}
      </Box>
      <Typography sx={{ color: '#f8fafc', fontWeight: 700, fontSize: '1.05rem', mb: 1 }}>{title}</Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7 }}>{desc}</Typography>
    </Box>
  );
}

// ── Visual panels ──────────────────────────────────────────────────────────
const waveBar = keyframes`
  0%,100% { transform: scaleY(0.4); }
  50%      { transform: scaleY(1); }
`;
const typingCursor = keyframes`
  0%,100% { opacity: 1; }
  50% { opacity: 0; }
`;

function WaveformPanel({ accent }) {
  const bars = [0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 1, 0.45, 0.7, 0.95, 0.6, 0.75, 0.5, 0.85, 0.7, 0.92, 0.6];
  return (
    <Box sx={{ p: { xs: 4, md: 6 }, background: `${accent}08`, border: `1px solid ${accent}20`, borderRadius: '28px', minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Live indicator */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
        <Typography sx={{ color: '#10b981', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Live Transcribing</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px', mb: 3 }}>
        {bars.map((h, i) => (
          <Box key={i} sx={{ width: 5, borderRadius: 2, height: `${h * 48}px`, background: `linear-gradient(180deg, ${accent}, ${accent}66)`, animation: `${waveBar} ${0.8 + i * 0.07}s ease-in-out infinite`, animationDelay: `${i * 0.06}s` }} />
        ))}
      </Box>
      <Box sx={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', p: 2.5 }}>
        <Typography sx={{ color: '#475569', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>Detected • Luganda → English</Typography>
        <Typography sx={{ color: '#f8fafc', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.7 }}>
          "Oli otya?" →{' '}
          <Box component="span" sx={{ color: accent, fontWeight: 700 }}>"How are you?"</Box>
          <Box component="span" sx={{ animation: `${typingCursor} 1s infinite`, borderRight: `2px solid ${accent}`, ml: 0.5, display: 'inline-block', height: '1em', verticalAlign: 'middle' }} />
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
          <Chip label="99.4% confidence" size="small" sx={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30`, borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700 }} />
          <Chip label="< 280ms" size="small" sx={{ background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 600 }} />
        </Box>
      </Box>
    </Box>
  );
}

function AgentPanel({ accent }) {
  const msgs = [
    { role: 'user', text: 'Nsaba obulamu ogwange!', sub: 'Health Records Request' },
    { role: 'bot',  text: 'Nkakasa okukuwa amawulire agakwata ku bulamu bwagwe...', sub: 'Processing in Luganda' },
    { role: 'user', text: 'Webale!', sub: 'Thank you' },
  ];
  return (
    <Box sx={{ p: { xs: 4, md: 5 }, background: `${accent}08`, border: `1px solid ${accent}20`, borderRadius: '28px', minHeight: 300, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Chat sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
          <Box>
            <Typography sx={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.9rem' }}>A-Voices Agent</Typography>
            <Typography sx={{ color: '#10b981', fontSize: '0.72rem', fontWeight: 600 }}>● Online</Typography>
          </Box>
        </Box>
        <Chip label="Luganda" size="small" sx={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30`, borderRadius: '50px', fontWeight: 700, fontSize: '0.7rem' }} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {msgs.map((m, i) => (
          <Box key={i} sx={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <Box sx={{ maxWidth: '80%', background: m.role === 'user' ? G : 'rgba(255,255,255,0.06)', border: m.role === 'bot' ? '1px solid rgba(255,255,255,0.08)' : 'none', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', px: 2, py: 1.5 }}>
              <Typography sx={{ color: m.role === 'user' ? '#fff' : '#f8fafc', fontSize: '0.85rem', fontWeight: 500 }}>{m.text}</Typography>
              <Typography sx={{ color: m.role === 'user' ? 'rgba(255,255,255,0.7)' : '#475569', fontSize: '0.68rem', mt: 0.5 }}>{m.sub}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function ApiPanel({ accent }) {
  const snippet = `const client = new AvoicesClient({ apiKey: 'sk-...' });

const result = await client.transcribe({
  audioUrl: 'https://example.com/audio.mp3',
  language: 'lg',     // Luganda
  target:   'en',     // → English
});

console.log(result.transcript); // "Oli otya? → How are you?"
console.log(result.latency);    // 278ms`;

  return (
    <Box sx={{ borderRadius: '28px', overflow: 'hidden', border: `1px solid ${accent}20`, boxShadow: `0 24px 60px rgba(0,0,0,0.5)` }}>
      <Box sx={{ background: '#161625', px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 2, borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <Box sx={{ display: 'flex', gap: 0.75 }}>
          {['#ef4444', '#f59e0b', '#10b981'].map(c => <Box key={c} sx={{ width: 11, height: 11, borderRadius: '50%', background: c }} />)}
        </Box>
        <Typography sx={{ color: '#475569', fontSize: '0.78rem', fontWeight: 600 }}>transcribe.js</Typography>
      </Box>
      <Box component="pre" sx={{
        m: 0, p: 3, background: '#0d0d1f', color: '#94a3b8',
        fontSize: '0.82rem', lineHeight: 1.7, overflow: 'auto',
        fontFamily: '"Fira Code", monospace',
        '& .kw': { color: '#8b5cf6' },
        '& .str': { color: '#10b981' },
        '& .fn': { color: '#0ea5e9' },
        '& .cm': { color: '#374151', fontStyle: 'italic' },
      }}>
        <Box component="span" className="kw">const </Box>client = <Box component="span" className="kw">new </Box><Box component="span" className="fn">AvoicesClient</Box>{'({ apiKey: '}<Box component="span" className="str">'sk-...'</Box>{' });\n\n'}<Box component="span" className="kw">const </Box>result = <Box component="span" className="kw">await </Box>client.<Box component="span" className="fn">transcribe</Box>{'({\n  audioUrl: '}<Box component="span" className="str">'https://example.com/audio.mp3'</Box>{',\n  language: '}<Box component="span" className="str">'lg'</Box>{'  '}<Box component="span" className="cm">// Luganda</Box>{'\n  target:   '}<Box component="span" className="str">'en'</Box>{'  '}<Box component="span" className="cm">// → English</Box>{'\n});\n\nconsole.'}<Box component="span" className="fn">log</Box>{'(result.transcript); '}<Box component="span" className="cm">// "Oli otya? → How are you?"</Box>{'\nconsole.'}<Box component="span" className="fn">log</Box>{'(result.latency);    '}<Box component="span" className="cm">// 278ms</Box>
      </Box>
    </Box>
  );
}

// ── Showcase section ───────────────────────────────────────────────────────
function ShowcaseSection({ tag, tagColor, headline, body, bullets, cta, ctaPath, visual, reverse }) {
  const VisualPanel = visual.panel;
  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center" direction={reverse ? 'row-reverse' : 'row'}>
          <Grid item xs={12} md={6}>
            <Chip label={tag} size="small" sx={{
              background: `${tagColor}18`, border: `1px solid ${tagColor}40`,
              color: tagColor, fontWeight: 700, fontSize: '0.8rem', borderRadius: '50px',
              mb: 3, '& .MuiChip-label': { px: 2 },
            }} />
            <Typography variant="h2" sx={{
              color: '#f8fafc', fontWeight: 800, fontSize: { xs: '2rem', md: '2.6rem' },
              lineHeight: 1.15, letterSpacing: '-0.02em', mb: 2.5,
            }}>
              {headline}
            </Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.75, mb: 3.5 }}>
              {body}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
              {bullets.map(b => (
                <Box key={b} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CheckCircle sx={{ fontSize: 18, color: tagColor, flexShrink: 0 }} />
                  <Typography sx={{ color: '#cbd5e1', fontSize: '0.95rem', fontWeight: 500 }}>{b}</Typography>
                </Box>
              ))}
            </Box>
            <Button
              component={Link} to={ctaPath} variant="contained" endIcon={<ArrowForward />}
              sx={{
                background: G, color: '#fff', fontWeight: 700,
                px: 3, py: 1.4, borderRadius: '50px', fontSize: '0.95rem',
                boxShadow: `0 6px 24px ${tagColor}50`,
                '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 10px 32px ${tagColor}60` },
              }}
            >
              {cta}
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <VisualPanel accent={tagColor} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export default function ServiceSections() {
  return (
    <Box sx={{ background: '#07071a' }} id="features">
      {/* ── Feature grid ─────────────────────────── */}
      <Box sx={{ py: { xs: 10, md: 14 }, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8, animation: `${slideUp} 0.6s ease both` }}>
            <Chip label="Everything You Need" size="small" sx={{
              background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
              color: GOLD, fontWeight: 700, borderRadius: '50px', mb: 2.5,
              '& .MuiChip-label': { px: 2 },
            }} />
            <Typography variant="h2" sx={{
              color: '#f8fafc', fontWeight: 800, fontSize: { xs: '2.2rem', md: '3rem' },
              letterSpacing: '-0.02em', mb: 2,
            }}>
              Every voice capability.{' '}
              <Box component="span" sx={{ background: G, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                One platform.
              </Box>
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: { xs: '1rem', md: '1.15rem' }, maxWidth: 560, mx: 'auto' }}>
              From real-time transcription to multi-language chatbots — built for Africa, ready for the world.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {FEATURES.map(f => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={f.title}>
                <FeatureCard {...f} />
              </Grid>
            ))}
            {/* CTA card */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Box sx={{
                background: G, borderRadius: '20px', p: 3,
                display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 180,
                position: 'relative', overflow: 'hidden',
                boxShadow: '0 16px 48px rgba(14,165,233,0.3)',
              }}>
                <Box sx={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', mb: 1, position: 'relative', zIndex: 1 }}>
                  Ready to start?
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', mb: 2.5, position: 'relative', zIndex: 1 }}>
                  Free forever. No credit card.
                </Typography>
                <Button
                  component={Link} to="/get-started"
                  sx={{
                    background: 'rgba(255,255,255,0.15)', color: '#fff',
                    fontWeight: 700, borderRadius: '50px', px: 2.5, py: 1,
                    border: '1px solid rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(8px)',
                    '&:hover': { background: 'rgba(255,255,255,0.25)' },
                    position: 'relative', zIndex: 1, width: 'fit-content',
                  }}
                  endIcon={<ArrowForward />}
                >
                  Get Started
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Gold divider ─────────────────────────── */}
      <Box sx={{ height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}60, transparent)`, mx: 'auto', maxWidth: '60%' }} />

      {/* ── Showcase sections ─────────────────────── */}
      {SHOWCASES.map((s, i) => (
        <Box key={i} sx={{ borderBottom: i < SHOWCASES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
          <ShowcaseSection {...s} />
        </Box>
      ))}

      {/* ── Bottom CTA strip ─────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Container maxWidth="md">
          <Box sx={{
            textAlign: 'center',
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '28px', p: { xs: 5, md: 7 },
            position: 'relative', overflow: 'hidden',
          }}>
            <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(14,165,233,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <Typography sx={{ color: GOLD, fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 2 }}>
              🌍 Trusted across Africa
            </Typography>
            <Typography variant="h2" sx={{
              color: '#f8fafc', fontWeight: 800, fontSize: { xs: '2rem', md: '2.8rem' },
              letterSpacing: '-0.02em', mb: 2.5,
            }}>
              Start building for free today
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '1.05rem', mb: 4, maxWidth: 480, mx: 'auto' }}>
              Join thousands of developers and enterprises building the future of African voice technology.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button component={Link} to="/get-started" variant="contained" size="large" endIcon={<ArrowForward />}
                sx={{
                  background: G, color: '#fff', fontWeight: 700,
                  px: 4, py: 1.6, borderRadius: '50px', fontSize: '1rem',
                  boxShadow: '0 8px 32px rgba(14,165,233,0.4)',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(14,165,233,0.55)' },
                }}
              >
                Create Free Account
              </Button>
              <Button component={Link} to="/pricing" variant="outlined" size="large"
                sx={{
                  borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)',
                  fontWeight: 700, px: 4, py: 1.6, borderRadius: '50px', fontSize: '1rem',
                  '&:hover': { borderColor: '#8b5cf6', color: '#a78bfa', background: 'rgba(139,92,246,0.08)' },
                }}
              >
                View Pricing
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

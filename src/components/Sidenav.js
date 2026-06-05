import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box, Avatar, CssBaseline, Divider, Drawer as MuiDrawer,
  IconButton, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, Tooltip, Chip, Collapse, useMediaQuery, useTheme,
  Stack,
} from '@mui/material';
import {
  ChevronLeft, ChevronRight,
  Translate as TranslateIcon,
  History as HistoryIcon,
  Api as ApiIcon,
  SmartToy as SmartToyIcon,
  Language as LanguageIcon,
  SupportAgent as SupportIcon,
  Upgrade as UpgradeIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  GraphicEq as VoiceCloneIcon,
  Person as PersonIcon,
  ExpandLess, ExpandMore,
  SettingsVoice as TranscribeIcon,
  Notes as SummarizeIcon,
  RecordVoiceOver as SynthIcon,
  Timeline as TimelineIcon,
  AccountBalanceWallet as WalletIcon,
  InterpreterMode as DubbingIcon,
  Mic as VoiceoverIcon,
  GridView as HomeIcon,
  HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../store/slices/uiSlice';
import { useAuth } from './AuthContext';
import { useSidebar } from '../hooks/useSidebar';
import { subscriptionAPI } from '../services/api';
import NotificationCenter from './NotificationCenter';
import { useTour } from './onboarding';
import { SEGMENT_TOURS, TOUR_IDS, dashboardTour } from './onboarding/tours';
import mvetlogo from '../assets/livestock.png';

const W = 260;
const CLOSED_W = 65;

// ── Brand Palette ─────────────────────────────────────────────────────────
const GOLD       = '#E8A020';
const GOLD_LIGHT = '#F5B844';
const GOLD_DARK  = '#C47F10';
const BLACK      = '#111111';
const BLACK_MID  = '#1A1A1A';
const OFFWHITE   = '#F8F6F0';

const sidebarBg = BLACK; // Black background for navbar

const openedMixin = (theme) => ({
  width: W, overflowX: 'hidden',
  background: sidebarBg,
  borderRight: `1px solid rgba(232,160,32,0.12)`,
  boxShadow: `4px 0 20px rgba(0,0,0,0.03)`,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
});

const closedMixin = (theme) => ({
  overflowX: 'hidden',
  background: sidebarBg,
  borderRight: `1px solid rgba(232,160,32,0.12)`,
  boxShadow: 'none',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: { width: `calc(${theme.spacing(8)} + 1px)` },
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.leavingScreen,
  }),
});

const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
  width: W, flexShrink: 0, whiteSpace: 'nowrap', boxSizing: 'border-box',
  '& .MuiDrawer-paper': { borderRight: 'none' },
  ...(open ? { ...openedMixin(theme), '& .MuiDrawer-paper': openedMixin(theme) }
           : { ...closedMixin(theme), '& .MuiDrawer-paper': closedMixin(theme) }),
}));

const NavItem = styled(ListItemButton)(({ active }) => ({
  minHeight: 42, borderRadius: 10, margin: '2px 10px',
  padding: '8px 12px',
  backgroundColor: active ? 'rgba(232,160,32,0.15)' : 'transparent',
  color: active ? GOLD_DARK : 'rgba(255,255,255,0.7)',
  position: 'relative',
  '&:hover': {
    backgroundColor: active ? 'rgba(232,160,32,0.22)' : 'rgba(255,255,255,0.08)',
    color: active ? GOLD_DARK : '#ffffff',
  },
  transition: 'all 0.2s ease',
  '& .MuiListItemIcon-root': {
    color: active ? GOLD_DARK : 'rgba(255,255,255,0.55)',
    minWidth: 32,
    transition: 'color 0.2s',
  },
  '&:hover .MuiListItemIcon-root': {
    color: active ? GOLD_DARK : '#ffffff',
  },
  '& .MuiListItemText-primary': {
    fontWeight: active ? 800 : 500,
    fontSize: '0.85rem',
    letterSpacing: '-0.01em',
  },
}));

const SectionLabel = ({ label, open }) => open ? (
  <Typography sx={{
    fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase',
    letterSpacing: '0.12em', color: 'rgba(255,255,255,0.45)',
    px: 3, mt: 3, mb: 1,
  }}>
    {label}
  </Typography>
) : <Divider sx={{ borderColor: 'rgba(232,160,32,0.15)', mx: 2, my: 2 }} />;

const MENU = [
  {
    section: 'Overview',
    items: [
      { label: 'Home', icon: <HomeIcon fontSize="small" />, path: '/dashboard/home' },
    ],
  },
  {
    section: 'Tools Studio',
    items: [
      { label: 'Transcribe', icon: <TranscribeIcon fontSize="small" />, path: '/dashboard/transcribe' },
      { label: 'Translate', icon: <TranslateIcon fontSize="small" />, path: '/dashboard/translate' },
      { label: 'Synthesize', icon: <SynthIcon fontSize="small" />, path: '/dashboard/synthesize' },
      // { label: 'Voice Cloning', icon: <VoiceCloneIcon fontSize="small" />, path: '/dashboard/voice-clone', badge: 'New', badgeColor: 'blue' },
      { label: 'Summarize', icon: <SummarizeIcon fontSize="small" />, path: '/dashboard/summarize' },
      { label: 'Video Dubbing', icon: <DubbingIcon fontSize="small" />, path: '/dashboard/dubbing', badge: 'Pro', badgeColor: 'blue' },
      { label: 'Voiceovers', icon: <VoiceoverIcon fontSize="small" />, path: '/dashboard/voiceovers', badge: 'New', badgeColor: 'blue' },
    ],
  },
  {
    section: 'Library',
    items: [
      { label: 'History', icon: <HistoryIcon fontSize="small" />, path: '/dashboard/history' },
    ],
  },
  {
    section: 'Developer',
    items: [
      { label: 'API Reference', icon: <ApiIcon fontSize="small" />, path: '/dashboard/api-reference' },
      { label: 'Languages', icon: <LanguageIcon fontSize="small" />, path: '/dashboard/lang-support' },
    ],
  },
  {
    section: 'Account',
    items: [
      { label: 'Usage Analytics', icon: <TimelineIcon fontSize="small" />, path: '/dashboard/usage' },
      { label: 'Upgrade Plan', icon: <UpgradeIcon fontSize="small" />, path: '/dashboard/subscription', badge: 'Pro' },
      { label: 'Help Center', icon: <SupportIcon fontSize="small" />, path: '/dashboard/contact-support' },
    ],
  },
];

export default function Sidenav() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { open, toggleDrawer } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const [balance, setBalance] = useState(null);
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();
  const { startTour } = useTour();

  const handleStartTour = () => {
    const seg = location.pathname.split('/').pop();
    const tour = SEGMENT_TOURS[seg];
    if (tour) {
      // Already on a page with a tour — start it for this screen.
      startTour(tour.id, tour.steps, { force: true });
    } else {
      // Fall back to the dashboard tour from anywhere else.
      navigate('/dashboard/home');
      setTimeout(() => startTour(TOUR_IDS.dashboard, dashboardTour, { force: true }), 350);
    }
  };

  const fetchBalance = () => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const uid = parsed.uid || parsed.userId;
        setUserId(uid || null);
        if (uid) {
          subscriptionAPI.getBalance(uid)
            .then(data => setBalance(data.balance ?? data.credit_balance ?? 0))
            .catch(() => {});
        }
      } catch (e) {}
    }
  };

  useEffect(() => {
    fetchBalance();
    window.addEventListener('refresh-balance', fetchBalance);
    return () => window.removeEventListener('refresh-balance', fetchBalance);
  }, []);

  useEffect(() => {
    const sidebarWidth = isMobile ? 0 : (open ? W : CLOSED_W);
    document.documentElement.style.setProperty('--avoices-sidebar-width', `${sidebarWidth}px`);
    return () => {
      document.documentElement.style.setProperty('--avoices-sidebar-width', '0px');
    };
  }, [open, isMobile]);

  const themeMode = useSelector(state => state.ui.theme.mode);
  const isDark = themeMode === 'dark';


  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const handleLogout = () => { logout(); navigate('/get-started'); };
  const handleNavClick = (path) => { navigate(path); if (isMobile) toggleDrawer(); };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        onClose={isMobile ? toggleDrawer : undefined}
        ModalProps={{ keepMounted: true }}
      >
        {/* Header */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          px: 2, py: 1.5, minHeight: 72,
          borderBottom: `1px solid rgba(232,160,32,0.12)`,
        }}>
          <Avatar
            src={mvetlogo}
            alt="Avoices"
            sx={{
              width: 40, height: 40, borderRadius: 1.5, flexShrink: 0,
              bgcolor: 'rgba(232,160,32,0.1)',
              border: `1.5px solid rgba(232,160,32,0.25)`,
            }}
          />
          {open && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff', lineHeight: 1.2 }}>
                Avoices
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                AI Platform
              </Typography>
            </Box>
          )}
          <IconButton
            onClick={toggleDrawer} size="small"
            sx={{
              color: '#ffffff', bgcolor: 'rgba(232,160,32,0.1)',
              border: `1px solid rgba(232,160,32,0.2)`,
              width: 30, height: 30, flexShrink: 0,
              '&:hover': { bgcolor: 'rgba(232,160,32,0.2)' },
            }}
          >
            {open ? <ChevronLeft fontSize="small" /> : <ChevronRight fontSize="small" />}
          </IconButton>
        </Box>

        {/* Nav */}
        <Box data-tour="nav-rail" sx={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(232,160,32,0.2)', borderRadius: 4 },
        }}>
          {MENU.map(({ section, items }) => (
            <Box key={section}>
              <SectionLabel label={section} open={open} />
              <List disablePadding>
                {items.map(({ label, icon, path, exact, badge, badgeColor }) => (
                  <ListItem key={path} disablePadding sx={{ display: 'block' }}>
                    <Tooltip title={open ? '' : label} placement="right" arrow>
                      <NavItem
                        active={isActive(path, exact) ? 1 : 0}
                        onClick={() => handleNavClick(path)}
                        sx={{ justifyContent: open ? 'initial' : 'center' }}
                      >
                        <ListItemIcon sx={{ mr: open ? 1.5 : 'auto', justifyContent: 'center' }}>
                          {icon}
                        </ListItemIcon>
                        {open && <ListItemText primary={label} />}
                        {open && badge && (
                          <Chip
                            label={badge} size="small"
                            sx={{
                              height: 18, fontSize: '0.6rem', fontWeight: 700,
                              ...(badgeColor === 'amber'
                                ? { bgcolor: 'rgba(232,160,32,0.15)', color: '#E8A020', border: '1px solid rgba(232,160,32,0.3)' }
                                : { bgcolor: 'rgba(232,160,32,0.15)', color: '#E8A020', border: '1px solid rgba(232,160,32,0.3)' }
                              ),
                              ml: 0.5,
                              '& .MuiChip-label': { px: 0.75 },
                            }}
                          />
                        )}
                      </NavItem>
                    </Tooltip>
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </Box>

        {/* Bottom account section */}
        <Box sx={{
          borderTop: `1px solid rgba(232,160,32,0.12)`,
          pb: 1,
        }}>
          {open ? (
            <>
              <NavItem active={0} onClick={() => setAccountOpen(v => !v)} sx={{ mx: 1, mt: 0.5 }}>
                <ListItemIcon sx={{ mr: 1.5 }}>
                  <AccountCircleIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)' }} />
                </ListItemIcon>
                <ListItemText primary="Account" />
                {accountOpen ? <ExpandLess sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }} />
                             : <ExpandMore sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }} />}
              </NavItem>
              <Collapse in={accountOpen} unmountOnExit>
                <List disablePadding sx={{ pl: 1 }}>
                  {[
                    { label: 'Profile', icon: <PersonIcon fontSize="small" />, path: '/dashboard/profile' },
                    { label: 'Usage Analytics', icon: <TimelineIcon fontSize="small" />, path: '/dashboard/usage' },
                  ].map(({ label, icon, path }) => (
                    <ListItem key={path} disablePadding>
                      <NavItem active={isActive(path) ? 1 : 0} onClick={() => handleNavClick(path)} sx={{ mx: 1, minHeight: 38 }}>
                        <ListItemIcon sx={{ mr: 1.5, minWidth: 20 }}>{icon}</ListItemIcon>
                        <ListItemText primary={label} sx={{ '& .MuiListItemText-primary': { fontSize: '0.8rem' } }} />
                      </NavItem>
                    </ListItem>
                  ))}
                  <ListItem disablePadding>
                    <NavItem active={0} onClick={handleLogout} sx={{
                      mx: 1, minHeight: 38,
                      '&:hover': { bgcolor: 'rgba(232,160,32,0.1)', color: GOLD },
                    }}>
                      <ListItemIcon sx={{ mr: 1.5, minWidth: 20 }}>
                        <LogoutIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </ListItemIcon>
                      <ListItemText primary="Logout" sx={{ '& .MuiListItemText-primary': { fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' } }} />
                    </NavItem>
                  </ListItem>
                </List>
              </Collapse>
            </>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, py: 0.5 }}>
              <Tooltip title="Profile" placement="right" arrow>
                <IconButton onClick={() => navigate('/dashboard/profile')} size="small"
                  sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(232,160,32,0.1)' } }}>
                  <AccountCircleIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Logout" placement="right" arrow>
                <IconButton onClick={handleLogout} size="small"
                  sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(232,160,32,0.1)' } }}>
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Main */}
      <Box component="main" sx={{
        flexGrow: 1, minHeight: '100vh',
        bgcolor: 'transparent',
        backgroundImage: 'radial-gradient(rgba(17, 17, 17, 0.05) 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
        width: { xs: '100%', md: `calc(100% - ${open ? W : 65}px)` },
        transition: 'width 0.2s ease',
      }}>
        {/* Page Title Bar */}
        <Box sx={{
          display: 'flex', alignItems: 'center',
          px: { xs: 2, md: 3 }, pt: { xs: 1.25, md: 1.75 }, pb: 0.75,
          minHeight: 56,
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(17, 17, 17, 0.04)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          {isMobile && (
            <IconButton
              onClick={toggleDrawer}
              sx={{ 
                bgcolor: 'rgba(232,160,32,0.1)',
                borderRadius: '12px', mr: 2,
                border: `1px solid rgba(232,160,32,0.25)`,
                color: GOLD,
                width: 40, height: 40,
                '&:hover': { bgcolor: 'rgba(232,160,32,0.2)' }
              }}
              size="small"
              aria-label="Open menu"
            >
              <ChevronRight fontSize="small" />
            </IconButton>
          )}
          <Box sx={{ flex: 1 }}>
            <Typography component="div" sx={{
              fontWeight: 900,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              color: BLACK,
              letterSpacing: '-0.03em',
              textTransform: 'capitalize',
              display: 'flex', alignItems: 'center', gap: 1
            }}>
              {(() => {
                const seg = location.pathname.split('/').pop();
                const labels = { home: 'Home', transcribe: 'Transcribe', translate: 'Translate', synthesize: 'Synthesize', 'voice-clone': 'Voice Cloning', summarize: 'Summarize', dubbing: 'Video Dubbing', voiceovers: 'Voiceovers', agents: 'AI Agents', history: 'Library', usage: 'Usage Analytics', 'api-reference': 'API Reference', 'lang-support': 'Languages', subscription: 'Subscription', profile: 'Account', 'contact-support': 'Support' };
                const icons = { home: <HomeIcon />, transcribe: <TranscribeIcon />, translate: <TranslateIcon />, synthesize: <SynthIcon />, 'voice-clone': <VoiceCloneIcon />, summarize: <SummarizeIcon />, dubbing: <DubbingIcon />, voiceovers: <VoiceoverIcon />, history: <HistoryIcon />, usage: <TimelineIcon />, profile: <PersonIcon /> };
                return (
                  <>
                    <Box sx={{ color: GOLD, display: { xs: 'none', sm: 'flex' } }}>{icons[seg]}</Box>
                    {labels[seg] || 'Dashboard'}
                  </>
                );
              })()}
            </Typography>
            {(() => {
              const seg = location.pathname.split('/').pop();
              const subtitles = {
                home: 'Your workspace overview, recent projects, and usage',
                usage: 'Monitor credit consumption and service usage',
                transcribe: 'Speech-to-text from files, recording, or video links',
                translate: 'Real-time text and document translation',
                synthesize: 'Neural text and document to speech',
                'voice-clone': 'Clone voice identity from sample audio',
                summarize: 'AI summaries for text, docs, audio, and video',
                dubbing: 'Translate and dub videos in multiple languages',
                voiceovers: 'Narration and slideshow voiceover generation',
                history: 'Your secure library for all AI-generated assets and dubs',
              };
              const subtitle = subtitles[seg];
              return subtitle ? (
                <Typography sx={{
                  mt: 0.2,
                  color: 'rgba(17,17,17,0.55)',
                  fontSize: { xs: '0.74rem', md: '0.78rem' },
                  fontWeight: 600,
                  lineHeight: 1.25,
                }}>
                  {subtitle}
                </Typography>
              ) : null;
            })()}
          </Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Wallet Chip for Dashboard Header */}
            <Box
              onClick={() => navigate('/dashboard/subscription')} 
              sx={{ 
                display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1, 
                px: 2, py: 0.8, borderRadius: '50px', 
                background: 'rgba(232,160,32,0.1)',
                border: `1px solid rgba(232,160,32,0.25)`,
                cursor: 'pointer', transition: 'all 0.2s',
                '&:hover': { background: 'rgba(232,160,32,0.2)' }
              }}
            >
              <WalletIcon sx={{ fontSize: 18, color: GOLD }} />
              <Box sx={{ fontWeight: 800, color: GOLD, fontSize: '0.85rem' }}>
                {balance !== null ? `${balance.toFixed(2)} Credits` : '...'}
              </Box>
            </Box>

            <Tooltip title="Help & product tour" placement="bottom" arrow>
              <IconButton
                data-tour="help"
                onClick={handleStartTour}
                size="small"
                sx={{
                  color: 'rgba(17,17,17,0.55)',
                  border: '1px solid rgba(17,17,17,0.08)',
                  '&:hover': { color: GOLD, background: 'rgba(232,160,32,0.1)', borderColor: 'rgba(232,160,32,0.25)' },
                }}
              >
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Box data-tour="notifications" sx={{ display: 'flex' }}>
              <NotificationCenter userId={userId} />
            </Box>
            <Avatar 
              onClick={() => navigate('/dashboard/profile')}
              sx={{ 
                width: 36, height: 36, cursor: 'pointer', 
                border: `2px solid rgba(232,160,32,0.15)`,
                transition: 'all 0.2s',
                '&:hover': { transform: 'scale(1.05)', borderColor: GOLD }
              }} 
            />
          </Stack>
        </Box>
        <Box sx={{ p: { xs: 1.25, md: 2.5 }, pt: { xs: 0.75, md: 1.25 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

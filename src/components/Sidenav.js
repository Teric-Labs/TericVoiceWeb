import React, { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box, Avatar, CssBaseline, Divider, Drawer as MuiDrawer,
  IconButton, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, Tooltip, Chip, Collapse, useMediaQuery, useTheme,
  Badge, Popover, Paper, Stack,
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
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Notifications as NotificationsIcon,
  NotificationsNone as NotificationsNoneIcon,
  SettingsVoice as TranscribeIcon,
  Notes as SummarizeIcon,
  RecordVoiceOver as SynthIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, removeNotification } from '../store/slices/uiSlice';
import { useAuth } from './AuthContext';
import { useSidebar } from '../hooks/useSidebar';
import mvetlogo from '../assets/livestock.png';

const W = 260;

const sidebarBg = '#0a0a0f'; // Elite Deep Slate

const openedMixin = (theme) => ({
  width: W, overflowX: 'hidden',
  background: sidebarBg,
  borderRight: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '4px 0 20px rgba(0,0,0,0.18)',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
});

const closedMixin = (theme) => ({
  overflowX: 'hidden',
  background: sidebarBg,
  borderRight: '1px solid rgba(255,255,255,0.08)',
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
  backgroundColor: active ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
  color: active ? '#0ea5e9' : '#94a3b8',
  position: 'relative',
  '&:hover': {
    backgroundColor: active ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.04)',
    color: active ? '#0ea5e9' : '#f8fafc',
  },
  transition: 'all 0.2s ease',
  '& .MuiListItemIcon-root': {
    color: active ? '#0ea5e9' : '#94a3b8',
    minWidth: 32,
    transition: 'color 0.2s',
  },
  '&:hover .MuiListItemIcon-root': {
    color: active ? '#0ea5e9' : '#f8fafc',
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
    letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)',
    px: 3, mt: 3, mb: 1,
  }}>
    {label}
  </Typography>
) : <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2, my: 2 }} />;

const MENU = [
  {
    section: 'Tools Studio',
    items: [
      { label: 'Transcribe', icon: <TranscribeIcon fontSize="small" />, path: '/dashboard/transcribe' },
      { label: 'Translate', icon: <TranslateIcon fontSize="small" />, path: '/dashboard/translate' },
      { label: 'Synthesize', icon: <SynthIcon fontSize="small" />, path: '/dashboard/synthesize' },
      { label: 'Voice Cloning', icon: <VoiceCloneIcon fontSize="small" />, path: '/dashboard/voice-clone', badge: 'New', badgeColor: 'blue' },
      { label: 'Summarize', icon: <SummarizeIcon fontSize="small" />, path: '/dashboard/summarize' },
      { label: 'AI Agents', icon: <SmartToyIcon fontSize="small" />, path: '/dashboard/agents', badge: 'Soon', badgeColor: 'amber' },
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
  const dispatch = useDispatch();
  const themeMode = useSelector(state => state.ui.theme.mode);
  const isDark = themeMode === 'dark';
  const notifications = useSelector(state => state.ui.notifications);
  const [notifAnchor, setNotifAnchor] = useState(null);

  const toggleDarkMode = () => dispatch(setTheme({ mode: isDark ? 'light' : 'dark' }));

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
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <Avatar
            src={mvetlogo}
            alt="A-Voices"
            sx={{
              width: 40, height: 40, borderRadius: 1.5, flexShrink: 0,
              bgcolor: 'rgba(255,255,255,0.15)',
              border: '1.5px solid rgba(255,255,255,0.2)',
            }}
          />
          {open && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#fff', lineHeight: 1.2 }}>
                A-Voices
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                AI Platform
              </Typography>
            </Box>
          )}
          <IconButton
            onClick={toggleDrawer} size="small"
            sx={{
              color: '#fff', bgcolor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              width: 30, height: 30, flexShrink: 0,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
            }}
          >
            {open ? <ChevronLeft fontSize="small" /> : <ChevronRight fontSize="small" />}
          </IconButton>
        </Box>

        {/* Nav */}
        <Box sx={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 4 },
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
                                ? { bgcolor: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }
                                : { bgcolor: 'rgba(14,165,233,0.15)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.3)' }
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
          borderTop: '1px solid rgba(255,255,255,0.1)',
          pb: 1,
        }}>
          {open ? (
            <>
              <NavItem active={0} onClick={() => setAccountOpen(v => !v)} sx={{ mx: 1, mt: 0.5 }}>
                <ListItemIcon sx={{ mr: 1.5 }}>
                  <AccountCircleIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.8)' }} />
                </ListItemIcon>
                <ListItemText primary="Account" />
                {accountOpen ? <ExpandLess sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }} />
                             : <ExpandMore sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }} />}
              </NavItem>
              <Collapse in={accountOpen} unmountOnExit>
                <List disablePadding sx={{ pl: 1 }}>
                  {[
                    { label: 'Profile', icon: <PersonIcon fontSize="small" />, path: '/dashboard/profile' },
                    { label: 'Settings', icon: <SettingsIcon fontSize="small" />, path: '/dashboard/settings' },
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
                      '&:hover': { bgcolor: 'rgba(239,68,68,0.2)' },
                    }}>
                      <ListItemIcon sx={{ mr: 1.5, minWidth: 20 }}>
                        <LogoutIcon fontSize="small" sx={{ color: '#fca5a5' }} />
                      </ListItemIcon>
                      <ListItemText primary="Logout" sx={{ '& .MuiListItemText-primary': { fontSize: '0.8rem', color: '#fca5a5' } }} />
                    </NavItem>
                  </ListItem>
                </List>
              </Collapse>
            </>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, py: 0.5 }}>
              <Tooltip title="Profile" placement="right" arrow>
                <IconButton onClick={() => navigate('/dashboard/profile')} size="small"
                  sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                  <AccountCircleIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Logout" placement="right" arrow>
                <IconButton onClick={handleLogout} size="small"
                  sx={{ color: '#fca5a5', '&:hover': { bgcolor: 'rgba(239,68,68,0.15)' } }}>
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
        bgcolor: 'background.default',
        width: { xs: '100%', md: `calc(100% - ${open ? W : 65}px)` },
      }}>
        {/* Page Title Bar */}
        <Box sx={{
          display: 'flex', alignItems: 'center',
          px: { xs: 2, md: 3 }, pt: 2, pb: 0,
          minHeight: 52,
        }}>
          {isMobile && (
            <IconButton
              onClick={toggleDrawer}
              sx={{ bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 1.5, mr: 1.5, border: '1px solid rgba(255,255,255,0.08)' }}
              size="small"
              aria-label="Open menu"
            >
              <ChevronRight fontSize="small" sx={{ color: '#f8fafc' }} />
            </IconButton>
          )}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{
              fontWeight: 800,
              fontSize: '1.1rem',
              color: '#f8fafc',
              letterSpacing: '-0.02em',
              textTransform: 'capitalize',
            }}>
              {(() => {
                const seg = location.pathname.split('/').pop();
                const labels = { transcribe: 'Transcribe Studio', translate: 'Translation Lab', synthesize: 'Speech Synthesis', 'voice-clone': 'Voice Cloning', summarize: 'Summarization', agents: 'AI Agents', history: 'History & Analytics', 'api-reference': 'API Reference', 'lang-support': 'Language Support', subscription: 'Upgrade Plan', profile: 'My Profile', settings: 'Settings', 'contact-support': 'Help Center' };
                return labels[seg] || 'Dashboard';
              })()}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

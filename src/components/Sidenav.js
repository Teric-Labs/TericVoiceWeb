import React, { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Avatar,
  CssBaseline,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  Badge,
  Chip,
  Fade,
  ListItemSecondaryAction,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
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
  Dashboard as DashboardIcon,
  Mic as MicIcon,
  VolumeUp as VolumeUpIcon,
  Summarize as SummarizeIcon,
  VideoLibrary as VideoLibraryIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  Assessment as AssessmentIcon,
  ExpandLess,
  ExpandMore,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../components/AuthContext';
import { useAppSelector } from '../store/hooks';
import { useSidebar } from '../hooks/useSidebar';
import mvetlogo from '../assets/livestock.png';

const drawerWidth = 280;

// Enhanced styled components with professional design - Blue gradient background
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  background: 'linear-gradient(180deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)',
  borderRight: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(20px)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(ellipse 60% 40% at 20% 0%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  background: 'linear-gradient(180deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)',
  borderRight: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(20px)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(ellipse 60% 40% at 20% 0%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2.5, 3),
  justifyContent: 'space-between',
  background: 'linear-gradient(180deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  minHeight: '96px !important',
  height: '96px',
  boxShadow: 'inset 0 -1px 0 rgba(255, 255, 255, 0.08)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)',
  },
}));

const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    borderRight: 'none',
  },
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const MainContent = styled('main')(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  backgroundColor: '#f8fafc',
  minHeight: '100vh',
  backgroundImage: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  minHeight: 44,
  borderRadius: 10,
  margin: '2px 10px',
  padding: '10px 14px',
  position: 'relative',
  backgroundColor: active 
    ? 'rgba(255, 255, 255, 0.15)' 
    : 'transparent',
  color: '#ffffff',
  '&::before': active ? {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 3,
    height: '60%',
    backgroundColor: '#ffffff',
    borderRadius: '0 2px 2px 0',
    boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
  } : {},
  '&:hover': {
    backgroundColor: active 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(255, 255, 255, 0.1)',
    transform: 'translateX(2px)',
    '& .MuiListItemIcon-root': {
      color: '#ffffff',
      transform: 'scale(1.05)',
    },
  },
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '& .MuiListItemIcon-root': {
    color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.2s ease',
    minWidth: 24,
  },
  '& .MuiListItemText-primary': {
    fontWeight: active ? 600 : 500,
    fontSize: '0.875rem',
    letterSpacing: '-0.01em',
    transition: 'all 0.2s ease',
    color: '#ffffff',
  },
}));

const CategoryHeader = styled(Typography)(({ theme }) => ({
  fontSize: '0.6875rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'rgba(255, 255, 255, 0.6)',
  marginBottom: '10px',
  marginTop: '20px',
  paddingLeft: '20px',
  paddingRight: '20px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -6,
    left: 20,
    right: 20,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
  },
}));

export default function Sidenav() {
  const theme = useTheme();
  const { open, isSmallScreen, toggleDrawer } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const { logout, user } = useAuth();
  const { notifications } = useAppSelector((state) => state.ui);

  // Reorganized menu items for better UX and to avoid repetition
  const menuItems = [
    {
      category: 'Main',
      items: [
        { 
          text: 'Translations', 
          icon: <TranslateIcon />, 
          path: '/dashboard',
          badge: null
        },
        { 
          text: 'AI Agents', 
          icon: <SmartToyIcon />, 
          path: '/dashboard/agents',
          badge: 'New'
        },
        { 
          text: 'Library', 
          icon: <VideoLibraryIcon />, 
          path: '/dashboard/history',
          badge: null
        },
      ],
    },
    {
      category: 'Resources',
      items: [
        { 
          text: 'API Reference', 
          icon: <ApiIcon />, 
          path: '/dashboard/api-reference',
          badge: null
        },
        { 
          text: 'Language Support', 
          icon: <LanguageIcon />, 
          path: '/dashboard/lang-support',
          badge: null
        },
        { 
          text: 'Documentation', 
          icon: <AssessmentIcon />, 
          path: '/dashboard/chat-guide',
          badge: null
        },
      ],
    },
    {
      category: 'Support',
      items: [
        { 
          text: 'Help Center', 
          icon: <SupportIcon />, 
          path: '/dashboard/contact-support',
          badge: null
        },
        { 
          text: 'Upgrade Plan', 
          icon: <UpgradeIcon />, 
          path: '/dashboard/subscription',
          badge: 'Pro'
        },
      ],
    },
  ];

  const isActive = (path) => {
    // Handle nested routes and exact matches
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/get-started');
    handleMenuClose();
  };

  const handleAccountToggle = () => {
    setAccountOpen(!accountOpen);
  };

  const accountItems = [
    { 
      text: 'Profile', 
      icon: <PersonIcon />, 
      path: '/dashboard/profile'
    },
    { 
      text: 'Settings', 
      icon: <SettingsIcon />, 
      path: '/dashboard/settings'
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{ 
          mt: 1.5,
          '& .MuiPaper-root': {
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            minWidth: 200,
            padding: '8px',
            backdropFilter: 'blur(20px)',
            background: 'linear-gradient(180deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)',
          }
        }}
      >
        <MenuItem 
          onClick={() => { navigate('/dashboard/profile'); handleMenuClose(); }} 
          sx={{ 
            borderRadius: '8px', 
            mx: 0.5, 
            my: 0.25,
            px: 1.5,
            py: 1,
            transition: 'all 0.2s ease',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              transform: 'translateX(2px)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <AccountCircleIcon fontSize="small" sx={{ color: '#ffffff' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#ffffff' }}>Profile</Typography>
        </MenuItem>
        <MenuItem 
          onClick={() => { navigate('/dashboard/settings'); handleMenuClose(); }} 
          sx={{ 
            borderRadius: '8px', 
            mx: 0.5, 
            my: 0.25,
            px: 1.5,
            py: 1,
            transition: 'all 0.2s ease',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              transform: 'translateX(2px)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <SettingsIcon fontSize="small" sx={{ color: '#ffffff' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#ffffff' }}>Settings</Typography>
        </MenuItem>
        <Divider sx={{ my: 0.75, mx: 0.5, borderColor: 'rgba(255, 255, 255, 0.15)' }} />
        <MenuItem 
          onClick={handleLogout} 
          sx={{ 
            borderRadius: '8px', 
            mx: 0.5, 
            my: 0.25,
            px: 1.5,
            py: 1,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              transform: 'translateX(2px)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <LogoutIcon fontSize="small" sx={{ color: '#fecaca' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#fecaca' }}>Logout</Typography>
        </MenuItem>
      </Menu>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2.5, 
            flexGrow: 1, 
            position: 'relative', 
            zIndex: 1,
            minWidth: 0, // Allow text truncation
          }}>
            {/* Logo Container */}
            <Box sx={{ 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Box sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: 2.5,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                  borderColor: 'rgba(255, 255, 255, 0.35)',
                },
              }}>
            <Avatar
              src={mvetlogo}
                  alt="A-Voices Logo"
              sx={{
                    width: 48,
                    height: 48,
                borderRadius: 2,
                    border: 'none',
                    boxShadow: 'none',
                    background: 'transparent',
                  }}
                />
                {/* Status Indicator */}
                <Box sx={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: '2.5px solid #1e40af',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.1)',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  '@keyframes pulse': {
                    '0%, 100%': {
                      opacity: 1,
                    },
                    '50%': {
                      opacity: 0.8,
                    },
                  },
                }} />
              </Box>
            </Box>
            
            {/* Brand Text Container */}
            {open && (
              <Fade in={open} timeout={400}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 0.5,
                  minWidth: 0,
                  flex: 1,
                }}>
                <Typography 
                  variant="h6" 
                  noWrap 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#ffffff',
                      fontSize: '1.25rem',
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  A-Voices
                </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.75)',
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      lineHeight: 1.2,
                      opacity: 0.9,
                    }}
                  >
                    AI Platform
                  </Typography>
                </Box>
              </Fade>
            )}
          </Box>
          
          {/* Toggle Button */}
          <IconButton 
            onClick={toggleDrawer}
            size="small"
            sx={{ 
              color: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              zIndex: 1,
              flexShrink: 0,
              width: 36,
              height: 36,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                transform: 'scale(1.05)',
              },
            }}
          >
            {open ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
          </IconButton>
        </DrawerHeader>

        <Box sx={{ 
          px: open ? 2.5 : 1, 
          py: 2.5,
          height: 'calc(100vh - 96px)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
            margin: '8px 0',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            border: '2px solid transparent',
            backgroundClip: 'padding-box',
            transition: 'background 0.2s ease',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255, 255, 255, 0.35)',
            backgroundClip: 'padding-box',
          },
        }}>
          {/* Menu Items - Scrollable */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {menuItems.map((category) => (
            <Box key={category.category} sx={{ mb: 2 }}>
              {open && (
                <CategoryHeader>
                  {category.category}
                </CategoryHeader>
              )}
              <List sx={{ p: 0 }}>
                {category.items.map((item) => (
                  <ListItem
                    key={item.text}
                    disablePadding
                    sx={{ display: 'block', mb: 0.5 }}
                  >
                    <StyledListItemButton
                      active={isActive(item.path) ? 1 : 0}
                      onClick={() => navigate(item.path)}
                      sx={{
                        justifyContent: open ? 'initial' : 'center',
                        px: open ? 2 : 1,
                      }}
                    >
                      <Tooltip title={open ? '' : item.text} placement="right">
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 2 : 'auto',
                            justifyContent: 'center',
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                      </Tooltip>
                      {open && (
                        <ListItemText
                          primary={item.text}
                          sx={{
                            '& .MuiTypography-root': {
                              fontSize: '0.875rem',
                            },
                          }}
                        />
                      )}
                      {open && item.badge && (
                        <ListItemSecondaryAction>
                          <Chip
                            label={item.badge}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              letterSpacing: '0.02em',
                              backgroundColor: item.badge === 'New' 
                                ? '#10b981'
                                : '#fbbf24',
                              color: '#ffffff',
                              boxShadow: item.badge === 'New'
                                ? '0 2px 8px rgba(16, 185, 129, 0.4)'
                                : '0 2px 8px rgba(251, 191, 36, 0.4)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              '& .MuiChip-label': {
                                px: 1,
                                py: 0.25,
                              },
                            }}
                          />
                        </ListItemSecondaryAction>
                      )}
                    </StyledListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
          </Box>

          {/* Account Section - Collapsible */}
          <Box sx={{ 
            mt: 'auto', 
            pt: 2.5, 
            pb: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.1) 100%)',
          }}>
            {open ? (
              <>
                <StyledListItemButton
                  active={0}
                  onClick={handleAccountToggle}
                  sx={{
                    justifyContent: 'flex-start',
                    px: 2,
                    mb: accountOpen ? 0.5 : 0,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 24, mr: 2 }}>
                    <AccountCircleIcon sx={{ 
                      color: '#ffffff',
                      fontSize: 22,
                    }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Account"
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#ffffff',
                      },
                    }}
                  />
                  {accountOpen ? (
                    <ExpandLess sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                  ) : (
                    <ExpandMore sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                  )}
                </StyledListItemButton>
                
                <Collapse in={accountOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 2.5, pr: 1 }}>
                    {accountItems.map((item) => (
                      <ListItem key={item.text} disablePadding sx={{ mb: 0.25 }}>
                        <StyledListItemButton
                          active={isActive(item.path) ? 1 : 0}
                          onClick={() => navigate(item.path)}
                          sx={{
                            justifyContent: 'flex-start',
                            px: 2,
                            minHeight: 36,
                            borderRadius: 1.5,
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 28, mr: 1.5 }}>
                            {React.cloneElement(item.icon, {
                              sx: {
                                fontSize: 18,
                                color: isActive(item.path) 
                                  ? '#ffffff' 
                                  : 'rgba(255, 255, 255, 0.8)',
                              },
                            })}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.text}
                            sx={{
                              '& .MuiTypography-root': {
                                fontSize: '0.8125rem',
                                fontWeight: isActive(item.path) ? 600 : 500,
                                color: '#ffffff',
                              },
                            }}
                          />
                        </StyledListItemButton>
                      </ListItem>
                    ))}
                    <ListItem disablePadding sx={{ mt: 0.5 }}>
                      <StyledListItemButton
                        active={0}
                        onClick={handleLogout}
                        sx={{
                          justifyContent: 'flex-start',
                          px: 2,
                          minHeight: 36,
                          borderRadius: 1.5,
                          '&:hover': {
                            backgroundColor: 'rgba(239, 68, 68, 0.2)',
                            '& .MuiListItemIcon-root': {
                              color: '#fecaca',
                            },
                            '& .MuiListItemText-primary': {
                              color: '#fecaca',
                            },
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 28, mr: 1.5 }}>
                          <LogoutIcon sx={{ fontSize: 18, color: '#fecaca' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Logout"
                          sx={{
                            '& .MuiTypography-root': {
                              fontSize: '0.8125rem',
                              fontWeight: 500,
                              color: '#fecaca',
                            },
                          }}
                        />
                      </StyledListItemButton>
                    </ListItem>
                  </List>
                </Collapse>
              </>
            ) : (
              <Tooltip title="Account" placement="right" arrow>
                <IconButton 
                  onClick={handleAccountToggle}
                  sx={{ 
                    width: 42,
                    height: 42,
                    borderRadius: 2.5,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <AccountCircleIcon sx={{ color: '#ffffff', fontSize: 22 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Drawer>

      <MainContent open={open}>
        <Box sx={{ 
          p: 3,
          backgroundColor: 'transparent',
          minHeight: '100vh',
        }}>
          <Outlet />
        </Box>
      </MainContent>
    </Box>
  );
}
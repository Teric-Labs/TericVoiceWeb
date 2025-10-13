import React, { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  AppBar as MuiAppBar,
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
  Toolbar,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  Badge,
  Chip,
  Fade,
  ListItemSecondaryAction,
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
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useAuth } from '../components/AuthContext';
import { useAppSelector } from '../store/hooks';
import { useSidebar } from '../hooks/useSidebar';
import mvetlogo from '../assets/livestock.png';

const drawerWidth = 280;

// Enhanced styled components
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#ffffff',
  borderRight: '1px solid rgba(25, 118, 210, 0.08)',
  boxShadow: '2px 0 8px rgba(0, 0, 0, 0.06)',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: '#ffffff',
  borderRight: '1px solid rgba(25, 118, 210, 0.08)',
  boxShadow: '2px 0 8px rgba(0, 0, 0, 0.06)',
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  minHeight: '72px !important',
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  color: '#000000',
  boxShadow: '0 2px 20px rgba(0, 0, 0, 0.08)',
  borderBottom: '1px solid rgba(25, 118, 210, 0.08)',
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
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
  padding: theme.spacing(3),
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
  minHeight: 48,
  borderRadius: 12,
  margin: '4px 8px',
  padding: '12px 16px',
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: active 
      ? alpha(theme.palette.primary.main, 0.16) 
      : alpha(theme.palette.primary.main, 0.08),
    transform: 'translateX(4px)',
  },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '& .MuiListItemIcon-root': {
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    transition: 'color 0.3s ease',
  },
  '& .MuiListItemText-primary': {
    fontWeight: active ? 600 : 500,
    transition: 'font-weight 0.3s ease',
  },
}));

const CategoryHeader = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: theme.palette.text.secondary,
  marginBottom: '8px',
  marginTop: '16px',
  paddingLeft: '16px',
}));

export default function Sidenav() {
  const theme = useTheme();
  const { open, isSmallScreen, toggleDrawer } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout, user } = useAuth();
  const { notifications } = useAppSelector((state) => state.ui);

  // Reorganized menu items for better UX and to avoid repetition
  const menuItems = [
    {
      category: 'Main',
      items: [
        { 
          text: 'Dashboard', 
          icon: <DashboardIcon />, 
          path: '/dashboard',
          badge: null
        },
        { 
          text: 'History & Analytics', 
          icon: <HistoryIcon />, 
          path: '/dashboard/history',
          badge: null
        },
      ],
    },
    {
      category: 'AI Services',
      items: [
        { 
          text: 'AI Agents', 
          icon: <SmartToyIcon />, 
          path: '/dashboard/agents',
          badge: 'New'
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

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ minHeight: '72px !important' }}>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ 
              mr: 2,
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.12)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <MenuIcon sx={{ color: '#1976d2' }} />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ 
                fontWeight: 700, 
                color: '#1976d2',
                background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              A-Voices
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Search">
              <IconButton sx={{ 
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' },
              }}>
                <SearchIcon sx={{ color: '#1976d2' }} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton sx={{ 
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.12)' },
              }}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon sx={{ color: '#1976d2' }} />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Account">
              <IconButton onClick={handleProfileMenu} sx={{ ml: 1 }}>
                <Avatar
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    bgcolor: '#1976d2',
                    border: '2px solid rgba(25, 118, 210, 0.2)',
                    '&:hover': {
                      border: '2px solid #1976d2',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  alt={user?.username || 'User'}
                  src={user?.avatar}
                >
                  <AccountCircleIcon sx={{ color: '#ffffff' }} />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ 
          mt: 1,
          '& .MuiPaper-root': {
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(25, 118, 210, 0.08)',
          }
        }}
      >
        <MenuItem onClick={() => navigate('/dashboard/profile')} sx={{ borderRadius: '8px', mx: 1, my: 0.5 }}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" sx={{ color: '#1976d2' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Profile</Typography>
        </MenuItem>
        <MenuItem onClick={() => navigate('/dashboard/settings')} sx={{ borderRadius: '8px', mx: 1, my: 0.5 }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" sx={{ color: '#1976d2' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Settings</Typography>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleLogout} sx={{ borderRadius: '8px', mx: 1, my: 0.5 }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: '#1976d2' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Logout</Typography>
        </MenuItem>
      </Menu>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={mvetlogo}
              alt="Logo"
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
            />
            {open && (
              <Fade in={open}>
                <Typography 
                  variant="h6" 
                  noWrap 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#ffffff',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  A-Voices
                </Typography>
              </Fade>
            )}
          </Box>
          <IconButton 
            onClick={toggleDrawer}
            sx={{ 
              color: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>

        <Box sx={{ 
          px: 2, 
          py: 2,
          height: 'calc(100vh - 72px)',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(25, 118, 210, 0.2)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(25, 118, 210, 0.3)',
          },
        }}>
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
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              backgroundColor: item.badge === 'New' ? '#4caf50' : '#ff9800',
                              color: '#ffffff',
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
      </Drawer>

      <MainContent open={open}>
        <DrawerHeader />
        <Box sx={{ 
          p: 3,
          backgroundColor: 'transparent',
        }}>
          <Outlet />
        </Box>
      </MainContent>
    </Box>
  );
}
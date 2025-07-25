import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
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
  useMediaQuery,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
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
} from '@mui/icons-material';
import { useAuth } from '../components/AuthContext';
import mvetlogo from '../assets/livestock.png';

const drawerWidth = 260;

// Styled components
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#ffffff', // White background
  borderRight: '1px solid rgba(0, 0, 0, 0.1)', // Subtle black divider
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
  borderRight: '1px solid rgba(0, 0, 0, 0.1)',
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
  background: 'linear-gradient(90deg, #1976d2, #42a5f5)', // Blue gradient
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  backgroundColor: '#ffffff',
  color: '#000000', // Black text
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Black shadow
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
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
  backgroundColor: '#f5f5f5', // Light gray-white background
  minHeight: '100vh',
}));

export default function Sidenav() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { logout, user } = useAuth();

  const menuItems = [
    {
      category: 'Translate',
      items: [
        { text: 'Translations', icon: <TranslateIcon />, path: '/dashboard' },
        { text: 'History', icon: <HistoryIcon />, path: '/dashboard/history' },
        { text: 'APIs', icon: <ApiIcon />, path: '/dashboard/api-reference' },
      ],
    },
    {
      category: 'Conversation AI',
      items: [
        { text: 'AI Agents', icon: <SmartToyIcon />, path: '/dashboard/agents' },
        { text: 'Export Text Agent', icon: <SmartToyIcon />, path: '/dashboard/chat-guide' },
        { text: 'Export Voice Agent', icon: <SmartToyIcon />, path: '/dashboard/voice-guide' },
      ],
    },
    {
      category: 'Docs',
      items: [
        { text: 'Languages', icon: <LanguageIcon />, path: '/dashboard/lang-support' },
      ],
    },
    {
      category: 'Support',
      items: [
        { text: 'Help Center', icon: <SupportIcon />, path: '/dashboard/contact-support' },
        { text: 'Upgrade Plan', icon: <UpgradeIcon />, path: '/dashboard/subscription' },
      ],
    },
  ];

  useEffect(() => {
    setOpen(!isSmallScreen);
  }, [isSmallScreen]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const isActive = (path) => location.pathname === path;

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
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon sx={{ color: '#1976d2' }} /> {/* Blue icon */}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: 600, color: '#1976d2' }} // Blue text
          >
            A-Voices
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Account">
              <IconButton onClick={handleProfileMenu}>
                <Avatar
                  sx={{ width: 32, height: 32, bgcolor: '#1976d2' }} // Blue avatar
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
        sx={{ mt: 1 }}
      >
        <MenuItem onClick={() => navigate('/dashboard/profile')}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" sx={{ color: '#1976d2' }} /> {/* Blue icon */}
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => navigate('/dashboard/settings')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" sx={{ color: '#1976d2' }} />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: '#1976d2' }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pl: 1 }}>
            <Avatar
              src={mvetlogo}
              alt="Logo"
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                border: '2px solid #ffffff',
              }}
            />
            {open && (
              <Typography variant="h6" noWrap sx={{ fontWeight: 600, color: '#ffffff' }}>
                A-Voices
              </Typography>
            )}
          </Box>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon sx={{ color: '#ffffff' }} />
          </IconButton>
        </DrawerHeader>

        <Box sx={{ px: 2, py: 3 }}>
          {menuItems.map((category) => (
            <Box key={category.category} sx={{ mb: 3 }}>
              {open && (
                <Typography
                  variant="caption"
                  sx={{ px: 1, fontWeight: 500, color: '#000000' }} // Black text
                >
                  {category.category}
                </Typography>
              )}
              <List>
                {category.items.map((item) => (
                  <ListItem
                    key={item.text}
                    disablePadding
                    sx={{ display: 'block', mb: 0.5 }}
                  >
                    <ListItemButton
                      onClick={() => navigate(item.path)}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        borderRadius: 1,
                        backgroundColor: isActive(item.path)
                          ? 'rgba(25, 118, 210, 0.1)' // Light blue active background
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: isActive(item.path)
                            ? 'rgba(25, 118, 210, 0.1)'
                            : 'rgba(66, 165, 245, 0.1)', // Lighter blue hover
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Tooltip title={open ? '' : item.text} placement="right">
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 2 : 'auto',
                            justifyContent: 'center',
                            color: isActive(item.path) ? '#1976d2' : '#000000', // Blue or black
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                      </Tooltip>
                      <ListItemText
                        primary={item.text}
                        sx={{
                          opacity: open ? 1 : 0,
                          color: isActive(item.path) ? '#1976d2' : '#000000', // Blue or black
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </Box>
      </Drawer>

      <MainContent open={open}>
        <DrawerHeader />
        <Outlet />
      </MainContent>
    </Box>
  );
}
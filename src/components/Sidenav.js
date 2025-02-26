import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import {
  AppBar as MuiAppBar,
  Box,
  Avatar,
  Badge,
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
  Snackbar,
  Alert,
} from '@mui/material';

// Icons
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  GridView as DashboardIcon,
  History as HistoryIcon,
  SupportAgent as SupportIcon,
  Upgrade as UpgradeIcon,
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Analytics as AnalyticsIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

import { useAuth } from '../components/AuthContext';
import mvetlogo from '../assets/livestock.png';

const drawerWidth = 260;

// Styled components remain the same as before, just update the styling values
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
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
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
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
  backgroundColor: theme.palette.grey[100],
  minHeight: '100vh',
}));

export default function Sidenav() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { logout, user } = useAuth();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const menuItems = [
    {
      category: 'Translate',
      items: [
        { text: 'Translations', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'History', icon: <HistoryIcon />, path: '/dashboard/history' },
        { text: 'APIs', icon: <StorageIcon />, path: '/dashboard/api-reference' },
      ],
    },
    
    {
      category: 'Conversation AI',
      items: [
        { text: 'AI Agents', icon: <AnalyticsIcon />, path: '/dashboard/agents' },
        { text: 'Export Text Agent', icon: <AnalyticsIcon />, path: '/dashboard/chat-guide' },
        { text: 'Export Voice Agent', icon: <AnalyticsIcon />, path: '' },
      ],
    },

    {
      category: 'Docs',
      items: [
        { text: 'Langauges', icon: <SettingsIcon />, path: '/dashboard/lang-support' },
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

  const handleNotificationMenu = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchorEl(null);
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
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: 600 }}
          >
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton onClick={handleNotificationMenu}>
                <Badge badgeContent={3} color="error">
                  <NotificationIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Account">
              <IconButton onClick={handleProfileMenu}>
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  alt={user?.username || 'User'}
                  src={user?.avatar}
                >
                  <AccountCircleIcon />
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
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => navigate('/dashboard/settings')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleMenuClose}
        sx={{ mt: 1 }}
      >
        <MenuItem>New transcription completed</MenuItem>
        <MenuItem>Storage space alert</MenuItem>
        <MenuItem>System update available</MenuItem>
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
              }}
            />
            {open && (
              <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
                A-Voices
              </Typography>
            )}
          </Box>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>

        <Box sx={{ px: 2, py: 3 }}>
          {menuItems.map((category) => (
            <Box key={category.category} sx={{ mb: 3 }}>
              {open && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ px: 1, fontWeight: 500 }}
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
                          ? theme.palette.primary.light
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: isActive(item.path)
                            ? theme.palette.primary.light
                            : theme.palette.action.hover,
                        },
                      }}
                    >
                      <Tooltip title={open ? '' : item.text} placement="right">
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 2 : 'auto',
                            justifyContent: 'center',
                            color: isActive(item.path)
                              ? theme.palette.primary.main
                              : theme.palette.text.secondary,
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                      </Tooltip>
                      <ListItemText
                        primary={item.text}
                        sx={{
                          opacity: open ? 1 : 0,
                          color: isActive(item.path)
                            ? theme.palette.primary.main
                            : theme.palette.text.primary,
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

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity="info"
          sx={{ width: '100%' }}
          onClose={() => setShowSnackbar(false)}
        >
          Contact support at support@africanvoices.com
        </Alert>
      </Snackbar>
    </Box>
  );
}
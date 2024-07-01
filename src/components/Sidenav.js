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
  Collapse,
  Fab,
  Snackbar,
  Alert,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import MicIcon from '@mui/icons-material/Mic';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import TextToSpeechIcon from '@mui/icons-material/RecordVoiceOver';
import TranslateIcon from '@mui/icons-material/Translate';
import VoiceOverOffIcon from '@mui/icons-material/VoiceOverOff';
import SupportIcon from '@mui/icons-material/Support';
import EventIcon from '@mui/icons-material/Event';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import mvetlogo from '../assets/livestock.png';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#246EE9',
  color: 'white',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: theme.spacing(7) + 1,
  [theme.breakpoints.up('sm')]: {
    width: theme.spacing(9) + 1,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const CustomAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#246EE9',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    backgroundColor: '#246EE9',
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
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
  })
);

const MainContent = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  width: `calc(100% - ${open ? drawerWidth : theme.spacing(7) + 1}px)`,
  width: '100%',
  [theme.breakpoints.up('md')]: {
    marginLeft: 0,
    width: `calc(100% - ${drawerWidth}px)`,
  },
}));

export default function Sidenav({ children }) {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ username: '', userId: '' });
  const [showSnackbar, setShowSnackbar] = useState(false);

  const [openTranscription, setOpenTranscription] = useState(false);
  const [openTextTranslation, setOpenTextTranslation] = useState(false);
  const [openSpeech, setOpenSpeech] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  const handleTranscriptionClick = () => {
    setOpenTranscription(!openTranscription);
  };

  const handleTextTranslationClick = () => {
    setOpenTextTranslation(!openTextTranslation);
  };

  const handleSpeechClick = () => {
    setOpenSpeech(!openSpeech);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    {
      text: 'Transcription',
      icon: <MicIcon />,
      open: openTranscription,
      onClick: handleTranscriptionClick,
      children: [
        { text: 'Transcribe', icon: <MicIcon />, path: '/dashboard/transcribe' },
        { text: 'Vidscribe', icon: <SubtitlesIcon />, path: '/dashboard/videostream' },
        { text: 'AudioLive', icon: <LiveTvIcon />, path: '/dashboard/livestream' },
      ],
    },
    {
      text: 'Text Translation',
      icon: <TranslateIcon />,
      open: openTextTranslation,
      onClick: handleTextTranslationClick,
      children: [
        { text: 'Textify', icon: <TranslateIcon />, path: '/dashboard/translate' },
      ],
    },
    {
      text: 'Summarization',
      icon: <VoiceOverOffIcon />,
      open: openSpeech,
      onClick: handleSpeechClick,
      children: [
        { text: 'Text Summarization', icon: <TextToSpeechIcon />, path: '/dashboard/summarize' }
      ],
    },
    // {
    //   text: 'Speech',
    //   icon: <VoiceOverOffIcon />,
    //   open: openSpeech,
    //   onClick: handleSpeechClick,
    //   children: [
    //     { text: 'Voicify', icon: <TextToSpeechIcon />, path: '/dashboard/synthesize' },
        // { text: 'VoiceLingo', icon: <TranslateIcon />, path: '/dashboard/voxtrans' },
        // { text: 'VStream', icon: <VoiceOverOffIcon />, path: '/dashboard/voice' },
      // ],
    // },
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const isActive = (path) => location.pathname === path;

  const handleSnackbarOpen = () => {
    setShowSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <CustomAppBar position="fixed" open={open}>
        <Toolbar sx={{ backgroundColor: '' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 'auto' }}>
            <Avatar sx={{ bgcolor: 'white', width: 36, height: 36 }}>
              <MicIcon sx={{ color: 'black' }} />
            </Avatar>
            <Avatar sx={{ bgcolor: 'white', width: 36, height: 36 }}>
              <VoiceOverOffIcon sx={{ color: 'black' }} />
            </Avatar>
            <Avatar sx={{ bgcolor: 'white', width: 36, height: 36 }}>
              <TranslateIcon sx={{ color: 'black' }} />
            </Avatar>
            <Typography variant="body2" noWrap component="div" sx={{ color: 'white' }}>
              Hello {user.username}
            </Typography>
          </Box>
        </Toolbar>
      </CustomAppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <div style={{ background: 'white', borderRadius: '50%', padding: '5px', margin: '20px' }}>
            <img src={mvetlogo} alt="MVET Logo" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
          </div>
          <span>
            <Typography variant="h6" noWrap component="div">
              A-Voices
            </Typography>
            <Typography variant="body1">Dashboard</Typography>
          </span>
          <IconButton onClick={() => setOpen(!open)}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ backgroundColor: 'white' }} />
        <List sx={{ padding: 2, flexGrow: 1 }}>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem
                disablePadding
                sx={{
                  display: 'block',
                  margin: 2,
                  fontFamily: 'poppins',
                  fontSize: theme.typography.fontSize,
                  backgroundColor: isActive(item.path) ? theme.palette.primary.main : 'transparent',
                  color: isActive(item.path) ? theme.palette.primary.contrastText : theme.palette.primary.light,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    color: theme.palette.primary.contrastText,
                  },
                }}
                onClick={item.onClick ? item.onClick : () => navigate(item.path)}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon sx={{ color: isActive(item.path) ? 'black' : 'white' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0, color: isActive(item.path) ? 'black' : 'white' }} />
                  {item.children && (item.open ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>
              {item.children && (
                <Collapse in={item.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child, childIndex) => (
                      <ListItem
                        key={childIndex}
                        disablePadding
                        sx={{
                          display: 'block',
                          margin: 2,
                          fontFamily: 'poppins',
                          fontSize: theme.typography.fontSize,
                          backgroundColor: isActive(child.path) ? theme.palette.primary.main : 'transparent',
                          color: isActive(child.path) ? theme.palette.primary.contrastText : theme.palette.primary.light,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                            color: theme.palette.primary.contrastText,
                          },
                        }}
                        onClick={() => navigate(child.path)}
                      >
                        <ListItemButton
                          sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                          }}
                        >
                          <ListItemIcon sx={{ color: isActive(child.path) ? 'black' : 'white' }}>
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText primary={child.text} sx={{ opacity: open ? 1 : 0, color: isActive(child.path) ? 'black' : 'white' }} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
        <Divider sx={{ backgroundColor: 'white' }} />
        <List sx={{ padding: 2 }}>
          <ListItem
            disablePadding
            sx={{
              display: 'block',
              margin: 2,
              fontFamily: 'poppins',
              fontSize: theme.typography.fontSize,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                color: theme.palette.primary.contrastText,
              },
            }}
            onClick={() => navigate('/dashboard/contact-support')}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <SupportIcon />
              </ListItemIcon>
              <ListItemText primary="Contact Support" sx={{ opacity: open ? 1 : 0, color: 'white' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <MainContent open={open}>
        <DrawerHeader />
        <Outlet />
      </MainContent>
      <Fab
        color="primary"
        aria-label="contact support"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          width:100,
          height:100,
          zIndex: 100,
        }}
        onClick={handleSnackbarOpen}
      >
        <Typography>CONTACT SUPPORT</Typography>
      </Fab>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="info"
          sx={{ width: '100%' }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Contact support at labteric@gmail.com or call us at (256) 750371313.
        </Alert>
      </Snackbar>
    </Box>
  );
}

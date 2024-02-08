import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { AppBar as MuiAppBar, Box,Avatar, CssBaseline, Divider, Drawer as MuiDrawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import MicIcon from '@mui/icons-material/Mic';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import TextToSpeechIcon from '@mui/icons-material/RecordVoiceOver'; 
import TranslateIcon from '@mui/icons-material/Translate';
import VoiceOverOffIcon from '@mui/icons-material/VoiceOverOff';
import mvetlogo from '../assets/livestock.png'; 

const drawerWidth = 190;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: 'black',
  color: 'white',
});


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar
}));

const CustomAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
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

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width:190, // Set the desired width for the sidebar
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    ...(open && {
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
  }),
);
const MainContent = styled('div')(({ theme }) => ({
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  })
}));
export default function Sidenav({ children }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Livestream', icon: <LiveTvIcon />, path: '/livestream' },
    { text: 'Audio Transcription', icon: <MicIcon />, path: '/transcribe' },
    { text: 'Video Transcription', icon: <SubtitlesIcon />, path: '/videostream' },
    { text: 'Text2Speech', icon: <TextToSpeechIcon />, path: '/synthesize' },
    { text: 'Translation', icon: <TranslateIcon />, path: '/translate' },
    { text: 'Voice-to-Voice', icon: <VoiceOverOffIcon />, path: '/voice' }
  ];
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <CustomAppBar position="fixed" open={open}>
        <Toolbar sx={{backgroundColor:''}}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 ,marginLeft: 'auto'}}>
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
              Hello Guest
            </Typography>
          </Box>
        </Toolbar>
      </CustomAppBar>
      <Drawer variant="permanent" open={open} sx={{backgroundColor:'white'}}>
        <DrawerHeader>
          <div style={{ background: 'white', borderRadius: '50%', padding: '5px', margin: '20px' }}>
            <img src={mvetlogo} alt="MVET Logo" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
          </div>
          <span>
            <Typography variant="h6" noWrap component="div">
              A-Voices
            </Typography>
            <Typography variant="body1">
              Dashboard
            </Typography>
          </span>
          <IconButton onClick={() => setOpen(!open)}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider sx={{backgroundColor:'white'}}/>
        <List>
          {menuItems.map((item, index) => (
            <ListItem 
              key={index} 
              disablePadding 
              sx={{ 
                display: 'block', 
                backgroundColor: isActive(item.path) ? theme.palette.primary.main : 'transparent',
                color: isActive(item.path) ? theme.palette.primary.contrastText : theme.palette.primary.light,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  color: theme.palette.primary.contrastText,
                }
              }} 
              onClick={() => navigate(item.path)}
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
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <MainContent>
      <DrawerHeader />
        {children}
      </MainContent>
      {/* <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        
      </Box> */}
    </Box>
  );
}

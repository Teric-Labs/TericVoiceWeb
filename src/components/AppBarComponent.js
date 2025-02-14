import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useScrollTrigger,
  Slide,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import wrk from "../assets/microphone.png";

// Hide AppBar on scroll
const HideOnScroll = ({ children }) => {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

const AppBarComponent = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { title: 'Get Started', path: '/get-started' },
    { title: 'Pricing', path: '/pricing' },
    { title: 'APIs', path: '/documentation' },
    { title: 'Supported Languages', path: '/language-support' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          elevation={isScrolled ? 2 : 0}
          sx={{
            background: isScrolled 
              ? 'rgba(255, 255, 255, 0.95)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: isScrolled ? 'none' : '1px solid rgba(25, 118, 210, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ py: 1 }}>
              {/* Logo Section */}
              <IconButton
                component={Link}
                to="/"
                sx={{
                  mr: 2,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s ease',
                  },
                }}
              >
                <img 
                  src={wrk} 
                  alt="African Voices Logo" 
                  style={{ 
                    height: 40,
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
                  }} 
                />
              </IconButton>

              {/* Brand Name */}
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  flexGrow: { xs: 1, md: 0 },
                  mr: { md: 4 },
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  textDecoration: 'none',
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  letterSpacing: '-0.5px',
                }}
              >
                African Voices
              </Typography>

              {/* Desktop Navigation */}
              <Box 
                sx={{ 
                  flexGrow: 1,
                  display: { xs: 'none', md: 'flex' },
                  justifyContent: 'center',
                  gap: 2
                }}
              >
                {navigationItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={{
                      color: isActive(item.path) ? 'primary.main' : 'text.primary',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      px: 2,
                      py: 1,
                      borderRadius: '8px',
                      textTransform: 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: isActive(item.path) ? '10%' : '50%',
                        width: isActive(item.path) ? '80%' : '0%',
                        height: '2px',
                        backgroundColor: 'primary.main',
                        transition: 'all 0.3s ease',
                      },
                      '&:hover::after': {
                        left: '10%',
                        width: '80%',
                      },
                    }}
                  >
                    {item.title}
                  </Button>
                ))}
              </Box>

              {/* CTA Button */}
              <Button
                variant="contained"
                component={Link}
                to="/get-started"
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  ml: 2,
                  px: 3,
                  py: 1,
                  borderRadius: '28px',
                  textTransform: 'none',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
                  },
                }}
              >
                Get Started Free
              </Button>

              {/* Mobile Menu Button */}
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="start"
                onClick={() => setMobileOpen(true)}
                sx={{ display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '100%',
            maxWidth: '300px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{ mb: 2 }}
          >
            <CloseIcon />
          </IconButton>

          <List>
            {navigationItems.map((item) => (
              <ListItem
                key={item.path}
                component={Link}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: '8px',
                  mb: 1,
                  backgroundColor: isActive(item.path) 
                    ? 'rgba(25, 118, 210, 0.08)'
                    : 'transparent',
                }}
              >
                <ListItemText 
                  primary={item.title}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: isActive(item.path) ? 'primary.main' : 'text.primary',
                      fontWeight: 500,
                    },
                  }}
                />
              </ListItem>
            ))}

            <ListItem sx={{ mt: 2 }}>
              <Button
                variant="contained"
                fullWidth
                component={Link}
                to="/signup"
                onClick={() => setMobileOpen(false)}
                sx={{
                  py: 1,
                  borderRadius: '28px',
                  textTransform: 'none',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                }}
              >
                Get Started Free
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Spacer */}
      <Box sx={{ height: 72 }} />
    </>
  );
};

export default AppBarComponent;
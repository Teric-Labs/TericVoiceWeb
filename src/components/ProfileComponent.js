import React, { useState, useEffect } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Button,
  Paper,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Fade
} from '@mui/material';
import {
  Mail,
  User,
  Calendar,
  Settings,
  LogOut,
  Star,
  ChevronRight,
  Edit
} from 'lucide-react';

const ProfileComponent = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  const userDetails = [
    {
      icon: <Mail size={20} />,
      label: 'Email',
      value: user?.email || 'N/A',
    },
    {
      icon: <User size={20} />,
      label: 'User ID',
      value: user?.userId || 'N/A',
    },
    {
      icon: <Calendar size={20} />,
      label: 'Member Since',
      value: new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      }),
    }
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <Typography variant="h6" color="textSecondary">Loading profile...</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" alignItems="center" py={8}>
          <Typography variant="h4" gutterBottom>
            Welcome
          </Typography>
          <Typography variant="body1" color="textSecondary" align="center" paragraph>
            Please sign in to access your profile and preferences
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: 8,
              px: 6,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1.1rem',
              background: theme.palette.primary.main,
              '&:hover': {
                background: theme.palette.primary.dark,
              }
            }}
          >
            Sign In
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          background: '#ffffff'
        }}
      >
        {/* Premium Header Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            py: 6,
            px: 4,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative elements */}
          <Box
            sx={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: alpha('#fff', 0.1),
            }}
          />
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box display="flex" alignItems="center" gap={3}>
              <Box position="relative">
                <Avatar
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
                  sx={{
                    width: 120,
                    height: 120,
                    border: `4px solid ${alpha('#fff', 0.2)}`,
                    boxShadow: theme.shadows[4]
                  }}
                />
                <Tooltip title="Edit Profile Picture" placement="right">
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      background: '#fff',
                      '&:hover': { background: alpha('#fff', 0.9) }
                    }}
                  >
                    <Edit size={16} />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Box>
                <Typography variant="h4"  fontWeight="bold" gutterBottom>
                  {user.email}
                </Typography>
                <Typography variant="body1" color={alpha('#fff', 0.9)}>
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          {/* User Details Section */}
          <List sx={{ py: 2 }}>
            {userDetails.map((detail, index) => (
              <ListItem
                key={index}
                sx={{
                  py: 2,
                  px: 3,
                  mb: 2,
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  }
                }}
              >
                <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
                  {detail.icon}
                </ListItemIcon>
                <ListItemText
                  primary={detail.label}
                  secondary={detail.value}
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: 'textSecondary'
                  }}
                  secondaryTypographyProps={{
                    variant: 'body1',
                    color: 'textPrimary',
                    fontWeight: 500
                  }}
                />
                <ChevronRight size={20} color={theme.palette.text.secondary} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 4 }} />

          {/* Premium Banner */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.main} 100%)`,
              color: '#ffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Upgrade to Premium
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Unlock advanced features and unlimited usage
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Star size={18} />}
              sx={{
                backgroundColor: '#ffff',
                color: theme.palette.warning.main,
                px: 4,
                py: 1.5,
                borderRadius: 8,
                '&:hover': {
                  backgroundColor: alpha('#ffff', 0.9)
                }
              }}
            >
              Upgrade Now
            </Button>
          </Paper>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 4
            }}
          >
            <Button
              variant="outlined"
              startIcon={<Settings size={18} />}
              sx={{
                borderRadius: 8,
                px: 3,
                py: 1,
                borderColor: alpha(theme.palette.text.primary, 0.1),
                '&:hover': {
                  borderColor: alpha(theme.palette.text.primary, 0.2),
                  backgroundColor: alpha(theme.palette.text.primary, 0.02)
                }
              }}
            >
              Settings
            </Button>
            <Button
              variant="outlined"
              startIcon={<LogOut size={18} />}
              color="error"
              onClick={() => {
                localStorage.removeItem('user');
                window.location.reload();
              }}
              sx={{
                borderRadius: 8,
                px: 3,
                py: 1,
                borderColor: alpha(theme.palette.error.main, 0.3),
                color: theme.palette.error.main,
                '&:hover': {
                  borderColor: theme.palette.error.main,
                  backgroundColor: alpha(theme.palette.error.main, 0.04)
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfileComponent;
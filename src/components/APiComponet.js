import React from 'react';
import { 
  Typography, 
  Grid, 
  Container, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider
} from '@mui/material';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import TranslateIcon from '@mui/icons-material/Translate';
import RecordIcon from '@mui/icons-material/RecordVoiceOver';
import { Link } from 'react-router-dom';

let theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          padding: '10px 24px',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

const FeatureSection = ({ features }) => (
  <Box sx={{ bgcolor: '#1e1e1e', color: 'white', py: 8 }}>
    <Container maxWidth="lg">
      <Grid container spacing={6} alignItems="center">
        {features.map((feature, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Box sx={{ position: 'relative', p: 4, bgcolor: 'grey.900', borderRadius: 2 }}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 700 }}>
                {feature.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'grey.400' }}>
                {feature.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ mr: 2 }}>{feature.icon}</Box>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<PlayArrowIcon />}
                  sx={{ borderColor: 'primary.main', color: 'primary.main' }}
                >
                  Learn More
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

const PricingCard = ({ title, monthly, features }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" component="h3" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Box
        sx={{
          marginY: 3,
          padding: 2,
          border: '1px solid',
          borderColor: 'primary.light',
          borderRadius: 1,
          backgroundColor: 'primary.light',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" component="div" sx={{ color: 'primary.dark', fontWeight: 'bold' }}>
          {monthly}
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1 }}>
        {features.map((feature, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={feature} />
            </ListItem>
            {index < features.length - 1 && <Divider variant="middle" />}
          </React.Fragment>
        ))}
      </List>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          mt: 2,
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
      >
        Subscribe Now
      </Button>
    </CardContent>
  </Card>
);

const APIComponent = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 2,
          p: 6,
          mb: 6,
          backgroundImage: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)',
        }}
      >
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Unlock Seamless Communication in Uganda
        </Typography>
        <Typography variant="h4" align="center" paragraph>
          Experience the future of multilingual interaction with our Voice & Text Translation APIs
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="outlined"  component={Link} to="/api-reference" color="inherit" sx={{ mr: 2 }}>
            API Reference
          </Button>
          <Button variant="contained" color="secondary" component={Link} to="/get-started">
            Get Started For Free
          </Button>
        </Box>
      </Box>

      <FeatureSection
        features={[
          {
            title: "Voice to Text API",
            icon: <RecordVoiceOverIcon fontSize="large" />,
            description: "Convert spoken Ugandan languages into accurate text, supporting over 10 local dialects.",
          },
          {
            title: "Text to Text API",
            icon: <TextFieldsIcon fontSize="large" />,
            description: "Translate written content between multiple Ugandan languages seamlessly.",
          },
          {
            title: "Text to Voice API",
            icon: <TranslateIcon fontSize="large" />,
            description: "Transform written Ugandan language content into natural-sounding speech.",
          },
          {
            title: "Voice to Voice API",
            icon: <RecordIcon fontSize="large" />,
            description: "Enable real-time spoken translation between Ugandan languages.",
          },
        ]}
      />

      <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ mt: 8, mb: 6 }}>
        Choose Your Plan
      </Typography>

      <Grid container spacing={4}>
        {[
          { title: 'Basic', price: '$19/month', features: ['100,000 API calls', '24/7 support', 'Multiple language pairs'] },
          { title: 'Pro', price: '$49/month', features: ['100,000 API calls', '24/7 support', 'Multiple language pairs', 'Advanced analytics'] },
          { title: 'Enterprise', price: 'Custom Pricing', features: ['Unlimited API calls', '24/7 priority support', 'All language pairs', 'Advanced analytics', 'Dedicated account manager'] }
        ].map((plan, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <PricingCard
              title={plan.title}
              monthly={plan.price}
              features={plan.features}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  </ThemeProvider>
);

export default APIComponent;

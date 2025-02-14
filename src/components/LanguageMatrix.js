import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
  alpha,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import TranslateIcon from '@mui/icons-material/Translate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LanguageIcon from '@mui/icons-material/Language';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import UpdateIcon from '@mui/icons-material/Update';
import CssBaseline from '@mui/material/CssBaseline';

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
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: alpha('#000', 0.1),
        },
        head: {
          fontWeight: 600,
          backgroundColor: alpha('#1976d2', 0.05),
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

const StatsCard = ({ icon: Icon, title, value, description }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Icon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const LanguageMatrix = () => {
  const theme = useTheme();

  const languageData = [
    { name: 'English', code: 'en', region: 'Global' },
    { name: 'Luganda', code: 'lg', region: 'Uganda' },
    { name: 'Runyankole', code: 'nyn', region: 'Uganda' },
    { name: 'Acholi', code: 'ac', region: 'Uganda' },
    { name: 'Ateso', code: 'at', region: 'Uganda' },
    { name: 'French', code: 'fr', region: 'Global' },
    { name: 'Lumasaba', code: 'myx', region: 'Uganda' },
    { name: 'Lusoga', code: 'xog', region: 'Uganda' },
    { name: 'Swahili', code: 'sw', region: 'East Africa' }
  ];

  const supportMatrix = {
    'Text Translation': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara'],
    'Audio Transcription': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara'],
    'Video Transcription': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara'],
    'Text to Speech': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'Kinyarwanda'],
    'Voice to Voice': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'Kinyarwanda'],
    'Summarization': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara'],
    'LLM': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara'],
    'Voice Conversation': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'Kinyarwanda'],
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 2,
              p: { xs: 4, md: 6 },
              mb: 6,
              backgroundImage: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)',
            }}
          >
            <Typography variant="h2" component="h1" align="center" gutterBottom>
              Language Support Hub
            </Typography>
            <Typography variant="h5" align="center" paragraph>
              Empowering Global Communication with Advanced Language Services
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mt: 3 }}>
              <Chip
                icon={<TranslateIcon />}
                label={`${languageData.length} Languages`}
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  px: 2,
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
              <Chip
                icon={<LanguageIcon />}
                label={`${Object.keys(supportMatrix).length} Services`}
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  px: 2,
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
            </Box>
          </Box>

          {/* Stats Grid */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={4}>
              <StatsCard
                icon={LanguageIcon}
                title="Total Languages"
                value={languageData.length}
                description="Supported languages across all services"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatsCard
                icon={AutoGraphIcon}
                title="Service Coverage"
                value="95%"
                description="Average language support across services"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatsCard
                icon={UpdateIcon}
                title="Latest Update"
                value="Feb 2025"
                description="Most recent language additions"
              />
            </Grid>
          </Grid>

          {/* Filter Section */}
          <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<LanguageIcon />}
              sx={{ borderRadius: 50 }}
            >
              All Languages
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ borderRadius: 50 }}
            >
              East African
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ borderRadius: 50 }}
            >
              Global
            </Button>
          </Box>

          {/* Matrix Table */}
          <Paper sx={{ overflow: 'hidden', borderRadius: 2, boxShadow: theme.shadows[4] }}>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'white', minWidth: 200 }}>
                      Language (Code)
                    </TableCell>
                    {Object.keys(supportMatrix).map(service => (
                      <TableCell 
                        key={service} 
                        align="center"
                        sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white',
                          minWidth: 150
                        }}
                      >
                        {service}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {languageData.map(({ name, code, region }) => (
                    <TableRow key={name} hover>
                      <TableCell 
                        component="th" 
                        scope="row" 
                        sx={{ 
                          fontWeight: 500,
                          position: 'sticky',
                          left: 0,
                          bgcolor: 'background.paper',
                          zIndex: 1
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body1">{name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {code} • {region}
                          </Typography>
                        </Box>
                      </TableCell>
                      {Object.values(supportMatrix).map((supportedLangs, index) => (
                        <TableCell key={index} align="center">
                          {supportedLangs.includes(name) ? (
                            <Tooltip title="Supported">
                              <CheckCircleIcon sx={{ color: 'success.main' }} />
                            </Tooltip>
                          ) : (
                            <Tooltip title="Coming Soon">
                              <HourglassEmptyIcon sx={{ color: 'warning.main' }} />
                            </Tooltip>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LanguageMatrix;
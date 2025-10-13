import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Badge,
  Avatar,
  Stack,
  Divider,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Collapse,
  Fade,
  Zoom,
  Slide
} from '@mui/material';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import { styled, keyframes } from '@mui/material/styles';
import TranslateIcon from '@mui/icons-material/Translate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LanguageIcon from '@mui/icons-material/Language';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import UpdateIcon from '@mui/icons-material/Update';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import PublicIcon from '@mui/icons-material/Public';
import FlagIcon from '@mui/icons-material/Flag';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CssBaseline from '@mui/material/CssBaseline';

// Enhanced animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0px); 
  }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 15px rgba(25, 118, 210, 0.4); }
  50% { box-shadow: 0 0 30px rgba(25, 118, 210, 0.8); }
  100% { box-shadow: 0 0 15px rgba(25, 118, 210, 0.4); }
`;

// Floating background elements
const FloatingElement = ({ size, position, delay, color = '#1976d2' }) => (
  <Box
    sx={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color}20, ${color}05)`,
      border: `1px solid ${color}15`,
      ...position,
      animation: `${float} ${3 + Math.random() * 2}s ease-in-out infinite`,
      animationDelay: delay,
      zIndex: 0,
    }}
  />
);

// Enhanced Stats Card
const StatsCard = ({ icon: Icon, title, value, description, color = '#1976d2', trend, index }) => (
  <Card 
    sx={{ 
      height: '100%',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${alpha(color, 0.2)}`,
          borderRadius: '16px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: `${slideUp} 0.6s ease-out forwards`,
      animationDelay: `${0.1 * index}s`,
      opacity: 0,
      transform: 'translateY(30px)',
          '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: `0 12px 40px ${alpha(color, 0.3)}`,
        border: `1px solid ${alpha(color, 0.4)}`,
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.7)})`,
            animation: `${pulse} 2s infinite`,
            animationDelay: `${0.2 * index}s`,
          }}
        >
          <Icon sx={{ fontSize: 28, color: 'white' }} />
        </Avatar>
        {trend && (
          <Chip
            icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
            label={trend}
            size="small"
            sx={{
              backgroundColor: alpha('#4caf50', 0.1),
              color: '#4caf50',
          fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        )}
      </Box>
      <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold', color: color }}>
        {value}
      </Typography>
      <Typography variant="h6" component="div" sx={{ color: color, fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: '#666666', lineHeight: 1.4 }}>
        {description}
      </Typography>
    </CardContent>
  </Card>
);

// Language Card Component
const LanguageCard = ({ language, supportMatrix, index }) => {
  const [expanded, setExpanded] = useState(false);
  const supportedFeatures = Object.entries(supportMatrix).filter(([_, languages]) => 
    languages.includes(language.name)
  );
  const totalFeatures = Object.keys(supportMatrix).length;
  const supportPercentage = Math.round((supportedFeatures.length / totalFeatures) * 100);

  return (
    <Card
      sx={{
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha('#1976d2', 0.1)}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: `${slideUp} 0.6s ease-out forwards`,
        animationDelay: `${0.1 * index}s`,
        opacity: 0,
        transform: 'translateY(30px)',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
          border: `1px solid ${alpha('#1976d2', 0.3)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: `linear-gradient(135deg, #1976d2, #64b5f6)`,
                fontWeight: 'bold',
                fontSize: '1.2rem',
              }}
            >
              {language.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', mb: 0.5 }}>
                {language.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={language.code.toUpperCase()}
                  size="small"
                  sx={{
                    backgroundColor: alpha('#1976d2', 0.1),
                    color: '#1976d2',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                  }}
                />
                <Chip
                  icon={<PublicIcon sx={{ fontSize: 14 }} />}
                  label={language.region}
                  size="small"
                  sx={{
                    backgroundColor: alpha('#4caf50', 0.1),
                    color: '#4caf50',
                    fontWeight: 500,
                    fontSize: '0.7rem',
                  }}
                />
              </Box>
            </Box>
          </Box>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{
              color: '#1976d2',
              transition: 'transform 0.3s ease',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#666666', fontWeight: 500 }}>
              Support Coverage
            </Typography>
            <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600 }}>
              {supportPercentage}%
            </Typography>
          </Box>
          <Box
            sx={{
              width: '100%',
              height: 8,
              backgroundColor: alpha('#1976d2', 0.1),
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: `${supportPercentage}%`,
                height: '100%',
                background: `linear-gradient(90deg, #1976d2, #64b5f6)`,
                borderRadius: 4,
                transition: 'width 0.8s ease-in-out',
              }}
            />
          </Box>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
            Supported Features ({supportedFeatures.length}/{totalFeatures})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {supportedFeatures.map(([feature, _]) => (
              <Chip
                key={feature}
                icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                label={feature}
                size="small"
                sx={{
                  backgroundColor: alpha('#4caf50', 0.1),
                  color: '#4caf50',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                }}
              />
            ))}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

const LanguageMatrix = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedFeature, setSelectedFeature] = useState('All');
  const [viewMode, setViewMode] = useState(0); // 0: Table, 1: Cards
  const [showOnlySupported, setShowOnlySupported] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const languageData = [
    { name: 'English', code: 'en', region: 'Global', flag: '🇺🇸', population: '1.5B', priority: 'high' },
    { name: 'Luganda', code: 'lg', region: 'Uganda', flag: '🇺🇬', population: '8M', priority: 'high' },
    { name: 'Runyankole', code: 'nyn', region: 'Uganda', flag: '🇺🇬', population: '3M', priority: 'medium' },
    { name: 'Acholi', code: 'ac', region: 'Uganda', flag: '🇺🇬', population: '1.5M', priority: 'medium' },
    { name: 'Ateso', code: 'at', region: 'Uganda', flag: '🇺🇬', population: '1.8M', priority: 'medium' },
    { name: 'French', code: 'fr', region: 'Global', flag: '🇫🇷', population: '280M', priority: 'high' },
    { name: 'Lumasaba', code: 'myx', region: 'Uganda', flag: '🇺🇬', population: '1.2M', priority: 'low' },
    { name: 'Lusoga', code: 'xog', region: 'Uganda', flag: '🇺🇬', population: '2M', priority: 'medium' },
    { name: 'Swahili', code: 'sw', region: 'East Africa', flag: '🇹🇿', population: '200M', priority: 'high' },
    { name: 'Kinyarwanda', code: 'rw', region: 'Rwanda', flag: '🇷🇼', population: '12M', priority: 'medium' },
    { name: 'Lugbara', code: 'lgg', region: 'Uganda', flag: '🇺🇬', population: '1M', priority: 'low' },
    { name: 'Arabic', code: 'ar', region: 'Middle East', flag: '🇸🇦', population: '400M', priority: 'high' },
    { name: 'Spanish', code: 'es', region: 'Global', flag: '🇪🇸', population: '500M', priority: 'high' },
    { name: 'Portuguese', code: 'pt', region: 'Global', flag: '🇵🇹', population: '260M', priority: 'medium' },
    { name: 'German', code: 'de', region: 'Europe', flag: '🇩🇪', population: '100M', priority: 'medium' },
  ];

  const supportMatrix = {
    'Text Translation': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara', 'Arabic', 'Spanish', 'Portuguese', 'German'],
    'Audio Transcription': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara', 'Arabic', 'Spanish', 'Portuguese', 'German'],
    'Video Transcription': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara', 'Arabic', 'Spanish', 'Portuguese', 'German'],
    'Text to Speech': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'Kinyarwanda', 'Arabic', 'Spanish', 'Portuguese', 'German'],
    'Voice to Voice': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'Kinyarwanda', 'Arabic', 'Spanish', 'Portuguese', 'German'],
    'Summarization': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara', 'Arabic', 'Spanish', 'Portuguese', 'German'],
    'LLM': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'French', 'Kinyarwanda', 'Lugbara', 'Arabic', 'Spanish', 'Portuguese', 'German'],
    'Voice Conversation': ['English', 'Luganda', 'Runyankole', 'Swahili', 'Ateso', 'Acholi', 'Kinyarwanda', 'Arabic', 'Spanish', 'Portuguese', 'German'],
  };

  const regions = ['All', ...new Set(languageData.map(lang => lang.region))];
  const features = ['All', ...Object.keys(supportMatrix)];

  const getSupportStatus = (language, feature) => {
    const supportedLanguages = supportMatrix[feature] || [];
    return supportedLanguages.includes(language.name);
  };

  const getStatusIcon = (isSupported) => {
    return isSupported ? (
      <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
    ) : (
      <HourglassEmptyIcon sx={{ color: '#ff9800', fontSize: 20 }} />
    );
  };

  const getStatusChip = (isSupported) => {
    return (
      <Chip
        label={isSupported ? 'Supported' : 'Coming Soon'}
        size="small"
        sx={{
          backgroundColor: isSupported ? alpha('#4caf50', 0.1) : alpha('#ff9800', 0.1),
          color: isSupported ? '#4caf50' : '#ff9800',
          fontWeight: 600,
          fontSize: '0.75rem',
        }}
      />
    );
  };

  const filteredLanguages = languageData.filter(language => {
    const matchesSearch = language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         language.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         language.region.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = selectedRegion === 'All' || language.region === selectedRegion;
    
    const matchesFeature = selectedFeature === 'All' || getSupportStatus(language, selectedFeature);
    
    const matchesSupported = !showOnlySupported || Object.keys(supportMatrix).some(feature => 
      getSupportStatus(language, feature)
    );
    
    return matchesSearch && matchesRegion && matchesFeature && matchesSupported;
  });

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`language-tabpanel-${index}`}
      aria-labelledby={`language-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Box sx={{ 
        py: 2, 
        px: 2,
        background: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '100vw',
        border: '1px solid #e0e0e0',
        }}>
          {/* Floating background elements */}
          <FloatingElement size="120px" position={{ top: '10%', left: '5%' }} delay="0s" />
          <FloatingElement size="80px" position={{ top: '60%', left: '10%' }} delay="1s" color="#64b5f6" />
          <FloatingElement size="100px" position={{ top: '20%', right: '15%' }} delay="0.5s" />
          <FloatingElement size="60px" position={{ bottom: '30%', right: '5%' }} delay="1.5s" color="#42a5f5" />
          <FloatingElement size="140px" position={{ bottom: '10%', left: '20%' }} delay="2s" />
          
          {/* Main gradient overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: 'radial-gradient(ellipse at center, rgba(25, 118, 210, 0.02) 0%, transparent 70%)',
              zIndex: 1,
            }}
          />

          {/* Content */}
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Fade in={isVisible} timeout={1000}>
              <Typography
                  variant="h4"
                sx={{
                  fontWeight: 700,
                    color: '#1976d2',
                    mb: 1,
                    fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                }}
              >
                Language Support Matrix
              </Typography>
              </Fade>
              <Fade in={isVisible} timeout={1500}>
              <Typography
                  variant="body1"
                sx={{
                    color: '#666666',
                    maxWidth: '600px',
                  mx: 'auto',
                  fontWeight: 500,
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                }}
              >
                Comprehensive language support across all our AI-powered services
              </Typography>
              </Fade>
            </Box>

            {/* Statistics Cards */}
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              mb: 3,
              justifyContent: 'space-between'
            }}>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <StatsCard
                  icon={LanguageIcon}
                  title="Total Languages"
                  value={languageData.length}
                  description="Supported languages across our platform"
                  color="#1976d2"
                  trend="+2 this month"
                  index={0}
                />
              </Box>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <StatsCard
                  icon={TranslateIcon}
                  title="Translation Services"
                  value="8"
                  description="Different translation and processing services"
                  color="#4caf50"
                  trend="100% coverage"
                  index={1}
                />
              </Box>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <StatsCard
                  icon={AutoGraphIcon}
                  title="Coverage"
                  value="95%"
                  description="Language coverage for African languages"
                  color="#ff9800"
                  trend="+5% this quarter"
                  index={2}
                />
              </Box>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <StatsCard
                  icon={UpdateIcon}
                  title="Regular Updates"
                  value="Monthly"
                  description="New languages and features added regularly"
                  color="#9c27b0"
                  trend="Next: Hausa"
                  index={3}
                />
              </Box>
            </Box>

            {/* Search and Filter Section */}
            <Paper sx={{ 
              p: 2, 
              mb: 2, 
              borderRadius: '16px', 
              background: 'rgba(255, 255, 255, 0.95)', 
              backdropFilter: 'blur(10px)' 
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 2, 
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                  <TextField
                    fullWidth
                    placeholder="Search languages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#1976d2' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      }
                    }}
                  />
                </Box>
                <Box sx={{ flex: '1 1 150px', minWidth: '120px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Region</InputLabel>
                    <Select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      label="Region"
                      sx={{ borderRadius: '12px' }}
                    >
                      {regions.map(region => (
                        <MenuItem key={region} value={region}>{region}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: '1 1 150px', minWidth: '120px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Feature</InputLabel>
                    <Select
                      value={selectedFeature}
                      onChange={(e) => setSelectedFeature(e.target.value)}
                      label="Feature"
                      sx={{ borderRadius: '12px' }}
                    >
                      {features.map(feature => (
                        <MenuItem key={feature} value={feature}>{feature}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: '1 1 150px', minWidth: '120px' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showOnlySupported}
                        onChange={(e) => setShowOnlySupported(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Supported Only"
                  />
                </Box>
                <Box sx={{ flex: '1 1 150px', minWidth: '120px' }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedRegion('All');
                      setSelectedFeature('All');
                      setShowOnlySupported(false);
                    }}
                    sx={{ borderRadius: '12px' }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* View Mode Tabs */}
            <Box sx={{ mb: 2 }}>
              <Tabs
                value={viewMode}
                onChange={(e, newValue) => setViewMode(newValue)}
                centered
                sx={{
                  '& .MuiTab-root': {
                    borderRadius: '12px 12px 0 0',
                    fontWeight: 600,
                  },
                  '& .Mui-selected': {
                    color: '#1976d2',
                  },
                }}
              >
                <Tab label="Table View" />
                <Tab label="Card View" />
              </Tabs>
            </Box>

            {/* Table View */}
            <TabPanel value={viewMode} index={0}>
              <Paper sx={{ 
                p: 4, 
                borderRadius: '16px', 
                background: 'rgba(255, 255, 255, 0.95)', 
                backdropFilter: 'blur(10px)' 
              }}>
              <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: '#1976d2' }}>
                Language Support Overview
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>Language</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>Region</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>Population</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>Priority</TableCell>
                      {Object.keys(supportMatrix).map((feature) => (
                        <TableCell key={feature} sx={{ fontWeight: 600, color: '#1976d2', textAlign: 'center' }}>
                          {feature}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                      {filteredLanguages.map((language) => (
                        <TableRow key={language.code} sx={{ '&:hover': { backgroundColor: alpha('#1976d2', 0.02) } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ fontSize: '1.2rem' }}>{language.flag}</Typography>
                            <Typography sx={{ fontWeight: 600, color: '#1976d2' }}>
                              {language.name}
                            </Typography>
                            <Chip
                              label={language.code.toUpperCase()}
                              size="small"
                              sx={{
                                  backgroundColor: alpha('#1976d2', 0.1),
                                color: '#1976d2',
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: '#666666' }}>
                            {language.region}
                          </Typography>
                        </TableCell>
                          <TableCell>
                            <Typography sx={{ color: '#666666', fontWeight: 500 }}>
                              {language.population}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={language.priority}
                              size="small"
                              sx={{
                                backgroundColor: language.priority === 'high' ? alpha('#4caf50', 0.1) : 
                                              language.priority === 'medium' ? alpha('#ff9800', 0.1) : 
                                              alpha('#f44336', 0.1),
                                color: language.priority === 'high' ? '#4caf50' : 
                                       language.priority === 'medium' ? '#ff9800' : '#f44336',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                              }}
                            />
                        </TableCell>
                        {Object.keys(supportMatrix).map((feature) => {
                          const isSupported = getSupportStatus(language, feature);
                          return (
                            <TableCell key={feature} sx={{ textAlign: 'center' }}>
                              <Tooltip title={isSupported ? 'Supported' : 'Coming Soon'}>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                  {getStatusIcon(isSupported)}
                                </Box>
                              </Tooltip>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            </TabPanel>

            {/* Card View */}
            <TabPanel value={viewMode} index={1}>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 2,
                justifyContent: 'flex-start'
              }}>
                {filteredLanguages.map((language, index) => (
                  <Box sx={{ 
                    flex: '1 1 250px', 
                    minWidth: '250px',
                    maxWidth: '300px'
                  }} key={language.code}>
                    <LanguageCard
                      language={language}
                      supportMatrix={supportMatrix}
                      index={index}
                    />
                  </Box>
                ))}
              </Box>
            </TabPanel>

            {/* Feature Details */}
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              mt: 2,
              justifyContent: 'flex-start'
            }}>
              {Object.entries(supportMatrix).map(([feature, supportedLanguages]) => (
                <Box sx={{ 
                  flex: '1 1 250px', 
                  minWidth: '250px',
                  maxWidth: '300px'
                }} key={feature}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                        {feature}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, color: '#666666' }}>
                        {supportedLanguages.length} languages supported
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {supportedLanguages.slice(0, 3).map((lang) => (
                          <Chip
                            key={lang}
                            label={lang}
                            size="small"
                            sx={{
                              backgroundColor: alpha('#1976d2', 0.1),
                              color: '#1976d2',
                              fontWeight: 500,
                            }}
                          />
                        ))}
                        {supportedLanguages.length > 3 && (
                          <Chip
                            label={`+${supportedLanguages.length - 3} more`}
                            size="small"
                            sx={{
                              backgroundColor: alpha('#1976d2', 0.05),
                              color: '#1976d2',
                              fontWeight: 500,
                            }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>

            {/* Coming Soon Alert */}
            <Alert 
              severity="info" 
              icon={<InfoIcon />}
              sx={{ 
                mt: 2, 
                borderRadius: '12px',
                backgroundColor: alpha('#1976d2', 0.1),
                border: `1px solid ${alpha('#1976d2', 0.2)}`,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                <strong>Upcoming Languages:</strong> Hausa, Yoruba, Igbo, Amharic, and Somali are coming soon! 
                We're constantly expanding our language support based on user demand.
              </Typography>
            </Alert>
          </Box>
        </Box>
    </ThemeProvider>
  );
};

export default LanguageMatrix;
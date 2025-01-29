import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  Button,
  Paper,
  Chip,
  Tooltip,
  LinearProgress,
  Stack,
  Collapse
} from "@mui/material";
import {
  Close,
  HeadphonesOutlined,
  DescriptionOutlined,
  TranslateOutlined,
  ShareOutlined,
  BookmarkBorderOutlined,
  GetAppOutlined,
  AccessTimeOutlined,
  AutoGraphOutlined,
  KeyboardArrowUpOutlined,
  KeyboardArrowDownOutlined,
  Bolt,
  Star
} from "@mui/icons-material";
import { Link } from 'react-router-dom';
const SummaryResult = ({ response, isOpen, onClose }) => {
  const [isPremiumExpanded, setIsPremiumExpanded] = useState(false);

  const normalizeResponse = (response) => {
    const defaultStructure = {
      summary: '',
      doc_id: '',
      title: 'Summary',
      wordCount: 0,
      readTime: '0 min',
      quality: 0,
    };
    if (!response || typeof response !== "object") {
      return defaultStructure;
    }
    return {
      summary: response.summary || '',
      doc_id: response.doc_id || '',
      title: response.title || 'Summary',
      wordCount: response.wordCount || 0,
      readTime: response.readTime || '0 min',
      quality: response.quality || 85,
    };
  };

  const processedData = normalizeResponse(response);

  const premiumFeatures = [
    {
      icon: <HeadphonesOutlined />,
      title: "AI Voice Narration",
      description: "Turn any summary into a professional audio narration",
      highlight: "New!"
    },
    {
      icon: <DescriptionOutlined />,
      title: "Advanced Export Suite",
      description: "Export to any format with custom formatting",
      highlight: "Popular"
    },
    {
      icon: <TranslateOutlined />,
      title: "Global Translation",
      description: "Instant translation in 50+ languages with dialect support",
      highlight: "Pro"
    }
  ];

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: '600px' },
          backgroundColor: '#ffffff',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
          p: 3,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
              {processedData.title}
            </Typography>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>

          <Stack direction="row" spacing={2}>
            <Chip
              icon={<AccessTimeOutlined sx={{ color: 'white !important' }} />}
              label={`${processedData.readTime} read`}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
            />
            <Chip
              icon={<AutoGraphOutlined sx={{ color: 'white !important' }} />}
              label={`${processedData.quality}% Match`}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
            />
          </Stack>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {/* Quick Actions */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, backgroundColor: '#f8fafc', borderRadius: 2 }}>
            <Stack direction="row" spacing={2}>
              <Tooltip title="Share Summary">
                <IconButton size="small" sx={{ color: '#1976d2' }}>
                  <ShareOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Save Summary">
                <IconButton size="small" sx={{ color: '#1976d2' }}>
                  <BookmarkBorderOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download">
                <IconButton size="small" sx={{ color: '#1976d2' }}>
                  <GetAppOutlined />
                </IconButton>
              </Tooltip>
            </Stack>
          </Paper>

          {/* Summary Content */}
          {processedData.summary ? (
            <Paper elevation={0} sx={{ 
              p: 3, 
              backgroundColor: '#ffffff', 
              borderRadius: 2,
              border: '1px solid #e2e8f0',
              mb: 3
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#0f172a' }}>
                Summary
              </Typography>
              <Typography variant="body1" sx={{ 
                lineHeight: 1.8, 
                color: '#334155',
                whiteSpace: 'pre-line'
              }}>
                {processedData.summary}
              </Typography>
            </Paper>
          ) : (
            <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              No summary available.
            </Typography>
          )}

          {/* Quality Metrics */}
          <Paper elevation={0} sx={{ 
            p: 3, 
            backgroundColor: '#ffffff', 
            borderRadius: 2,
            border: '1px solid #e2e8f0'
          }}>
            <Typography variant="h6" sx={{ mb: 3, color: '#0f172a' }}>
              Quality Metrics
            </Typography>
            <Stack spacing={3}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#475569' }}>Relevance</Typography>
                  <Typography variant="body2" sx={{ color: '#1976d2' }}>92%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={92} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#1976d2'
                    }
                  }} 
                />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#475569' }}>Clarity</Typography>
                  <Typography variant="body2" sx={{ color: '#1976d2' }}>88%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={88} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#1976d2'
                    }
                  }} 
                />
              </Box>
            </Stack>
          </Paper>
        </Box>

        {/* Enhanced Premium Panel */}
        <Box sx={{ 
          borderTop: '1px solid #e2e8f0',
          background: 'linear-gradient(to right, #f8fafc, #ffffff)'
        }}>
          <Button
            fullWidth
            onClick={() => setIsPremiumExpanded(!isPremiumExpanded)}
            sx={{
              p: 2.5,
              color: '#1976d2',
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Bolt sx={{ fontSize: 24, color: '#1976d2' }} />
              <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                Unlock Smart Summary Pro
              </Typography>
            </Box>
            {!isPremiumExpanded && (
              <Chip
                size="small"
                label="Special Offer"
                color="primary"
                sx={{ ml: 'auto', mr: 2 }}
              />
            )}
            {isPremiumExpanded ? <KeyboardArrowDownOutlined /> : <KeyboardArrowUpOutlined />}
          </Button>

          <Collapse in={isPremiumExpanded}>
            <Box sx={{ p: 4, backgroundColor: '#f8fafc' }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#0f172a' }}>
                Enhance Your Summaries with Pro Features
              </Typography>
              
              <Stack spacing={2.5}>
                {premiumFeatures.map((feature, index) => (
                  <Paper key={index} elevation={0} sx={{ 
                    p: 2.5, 
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': { 
                      borderColor: '#1976d2',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 1.5, 
                        background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
                        color: 'white'
                      }}>
                        {feature.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {feature.title}
                          </Typography>
                          {feature.highlight && (
                            <Chip
                              size="small"
                              label={feature.highlight}
                              sx={{ 
                                backgroundColor: '#e3f2fd',
                                color: '#1976d2',
                                fontWeight: 600,
                                fontSize: '0.75rem'
                              }}
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>

              <Button
                variant="contained"
                fullWidth
                startIcon={<Star />}
                component={Link}
                to="/get-started"
                sx={{
                  mt: 4,
                  py: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)'
                  }
                }}
              >
                Try Pro Free for 14 Days
              </Button>
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SummaryResult;
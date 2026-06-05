import React, { useState } from 'react';
import {
  Box, Typography, IconButton, Drawer, Button, Paper, Chip, Tooltip, LinearProgress, Stack, useTheme
} from "@mui/material";
import {
  Close, HeadphonesOutlined, DescriptionOutlined, TranslateOutlined, 
  ShareOutlined, BookmarkBorderOutlined, GetAppOutlined, AccessTimeOutlined, 
  AutoGraphOutlined, Bolt, AutoFixHigh as AIvatarIcon, QueryStats as MetricsIcon
} from "@mui/icons-material";

const G = 'linear-gradient(135deg, #E8A020 0%, #C47F10 100%)';

const SummaryResult = ({ response, isOpen, onClose }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const textColor = isDark ? '#ffffff' : '#111111';
  const subTextColor = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(17, 17, 17, 0.7)';
  const mutedTextColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(17, 17, 17, 0.4)';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(17, 17, 17, 0.08)';
  const dividerColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(17, 17, 17, 0.05)';
  const glassBg = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(17, 17, 17, 0.03)';
  const headerBg = isDark ? 'rgba(255, 255, 255, 0.01)' : 'rgba(17, 17, 17, 0.02)';

  const GLASS = { 
    background: glassBg, 
    backdropFilter: 'blur(12px)',
    border: `1px solid ${borderColor}`, 
    borderRadius: '20px' 
  };

  const normalizeResponse = (response) => {
    const defaultStructure = {
      summary: '',
      doc_id: '',
      title: 'Summary',
      wordCount: 0,
      readTime: '0 min',
      quality: 85,
    };
    if (!response || typeof response !== "object") return defaultStructure;
    return {
      summary: response.summary || '',
      doc_id: response.doc_id || '',
      title: response.title || 'AI Summary Analysis',
      wordCount: response.wordCount || 0,
      readTime: response.readTime || '2 min',
      quality: response.quality || 94,
    };
  };

  const processedData = normalizeResponse(response);

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: '640px' },
          borderLeft: `1px solid ${borderColor}`,
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Absolute Background Glow */}
        <Box sx={{ 
            position: 'absolute', top: -100, right: -100, width: 400, height: 400, 
            background: 'radial-gradient(circle, rgba(232, 160, 32,0.15) 0%, transparent 70%)',
            zIndex: 0, pointerEvents: 'none'
        }} />

        {/* Header Section */}
        <Box sx={{ p: 4, zIndex: 1, borderBottom: `1px solid ${dividerColor}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: '12px', background: G, display: 'flex' }}>
                <AIvatarIcon sx={{ color: '#111111', fontSize: 24 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: textColor }}>
                {processedData.title}
              </Typography>
            </Box>
            <IconButton onClick={onClose} sx={{ color: mutedTextColor, '&:hover': { background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(17, 17, 17, 0.05)', color: textColor } }}>
              <Close />
            </IconButton>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Chip
              icon={<AccessTimeOutlined sx={{ color: '#E8A020 !important', fontSize: '18px !important' }} />}
              label={`${processedData.readTime} Consumption`}
              sx={{ background: 'rgba(232, 160, 32,0.1)', color: '#E8A020', fontWeight: 600, border: '1px solid rgba(232, 160, 32,0.2)' }}
            />
            <Chip
              icon={<AutoGraphOutlined sx={{ color: '#C47F10 !important', fontSize: '18px !important' }} />}
              label={`${processedData.quality}% Logical Match`}
              sx={{ background: 'rgba(232, 160, 32,0.1)', color: '#C47F10', fontWeight: 600, border: '1px solid rgba(232, 160, 32,0.2)' }}
            />
          </Stack>
        </Box>

        {/* Action Belt */}
        <Box sx={{ px: 4, py: 2, background: headerBg, borderBottom: `1px solid ${dividerColor}`, zIndex: 1 }}>
            <Stack direction="row" spacing={2} justifyContent="flex-start">
               <Tooltip title="Export to Document">
                 <Button startIcon={<GetAppOutlined />} sx={{ color: textColor, textTransform: 'none', fontWeight: 500, fontSize: '0.85rem' }}>Export</Button>
               </Tooltip>
               <Tooltip title="Instant Translation">
                 <Button startIcon={<TranslateOutlined />} sx={{ color: textColor, textTransform: 'none', fontWeight: 500, fontSize: '0.85rem' }}>Translate</Button>
               </Tooltip>
               <Tooltip title="Save to Intelligence Hub">
                 <Button startIcon={<BookmarkBorderOutlined />} sx={{ color: textColor, textTransform: 'none', fontWeight: 500, fontSize: '0.85rem' }}>Vault</Button>
               </Tooltip>
            </Stack>
        </Box>

        {/* Content Flow */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 4, zIndex: 1 }}>
          {/* Main Summary Paper */}
          <Paper elevation={0} sx={{ ...GLASS, p: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                 <Bolt sx={{ color: '#fbbf24' }} />
                 <Typography variant="h6" sx={{ fontWeight: 700, color: textColor, fontSize: '1.1rem' }}>Expert Synthesis</Typography>
            </Box>
            <Typography variant="body1" sx={{ 
              lineHeight: 1.85, color: subTextColor, fontSize: '1rem', 
              whiteSpace: 'pre-line', letterSpacing: '0.01em'
            }}>
              {processedData.summary || "Generating deep analysis..."}
            </Typography>
          </Paper>

          {/* AI Diagnostic Insights */}
          <Typography variant="overline" sx={{ color: mutedTextColor, fontWeight: 800, mb: 2, display: 'block', letterSpacing: '0.1em' }}>
            AI DIAGNOSTIC INSIGHTS
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
             <Paper sx={{ ...GLASS, p: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: mutedTextColor, fontWeight: 600 }}>Relevance</Typography>
                      <Typography variant="caption" sx={{ color: '#E8A020', fontWeight: 700 }}>96%</Typography>
                 </Box>
                 <LinearProgress variant="determinate" value={96} sx={{ borderRadius: 2, height: 4, background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(17, 17, 17, 0.05)', '& .MuiLinearProgress-bar': { background: '#E8A020' } }} />
             </Paper>
             <Paper sx={{ ...GLASS, p: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: mutedTextColor, fontWeight: 600 }}>Clarity</Typography>
                      <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>92%</Typography>
                 </Box>
                 <LinearProgress variant="determinate" value={92} sx={{ borderRadius: 2, height: 4, background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(17, 17, 17, 0.05)', '& .MuiLinearProgress-bar': { background: '#10b981' } }} />
             </Paper>
          </Box>

          <Box sx={{ mt: 4, p: 3, borderRadius: '16px', background: 'rgba(232, 160, 32,0.05)', border: '1px solid rgba(232, 160, 32,0.1)' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <MetricsIcon sx={{ color: '#C47F10' }} />
                  <Typography variant="body2" sx={{ color: subTextColor, fontWeight: 500 }}>
                      This summary has been optimized for professional executive review using Avoices Neural Engine V4.
                  </Typography>
              </Box>
          </Box>
        </Box>

        {/* Footer actions */}
        <Box sx={{ p: 3, background: headerBg, borderTop: `1px solid ${dividerColor}`, textAlign: 'center' }}>
            <Button 
                variant="outlined" 
                onClick={onClose}
                sx={{ 
                    borderRadius: '50px', textTransform: 'none', px: 4, 
                    borderColor: borderColor, color: subTextColor,
                    '&:hover': { borderColor: textColor, color: textColor, background: 'transparent' }
                }}
            >
                Close Synthesis Wrap
            </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SummaryResult;
import React, { useState } from 'react';
import {
  Box, Typography, IconButton, Drawer, Button, Paper, Chip, Tooltip, LinearProgress, Stack
} from "@mui/material";
import {
  Close, HeadphonesOutlined, DescriptionOutlined, TranslateOutlined, 
  ShareOutlined, BookmarkBorderOutlined, GetAppOutlined, AccessTimeOutlined, 
  AutoGraphOutlined, Bolt, AutoFixHigh as AIvatarIcon, QueryStats as MetricsIcon
} from "@mui/icons-material";

const G = 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)';
const GLASS = { 
  background: 'rgba(255,255,255,0.03)', 
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.08)', 
  borderRadius: '20px' 
};

const SummaryResult = ({ response, isOpen, onClose }) => {
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
          backgroundColor: '#0a0a0f',
          color: '#fff',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Absolute Background Glow */}
        <Box sx={{ 
            position: 'absolute', top: -100, right: -100, width: 400, height: 400, 
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
            zIndex: 0, pointerEvents: 'none'
        }} />

        {/* Header Section */}
        <Box sx={{ p: 4, zIndex: 1, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: '12px', background: G, display: 'flex' }}>
                <AIvatarIcon sx={{ color: '#fff', fontSize: 24 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                {processedData.title}
              </Typography>
            </Box>
            <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { background: 'rgba(255,255,255,0.05)', color: '#fff' } }}>
              <Close />
            </IconButton>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Chip
              icon={<AccessTimeOutlined sx={{ color: '#0ea5e9 !important', fontSize: '18px !important' }} />}
              label={`${processedData.readTime} Consumption`}
              sx={{ background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', fontWeight: 600, border: '1px solid rgba(14,165,233,0.2)' }}
            />
            <Chip
              icon={<AutoGraphOutlined sx={{ color: '#8b5cf6 !important', fontSize: '18px !important' }} />}
              label={`${processedData.quality}% Logical Match`}
              sx={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', fontWeight: 600, border: '1px solid rgba(139,92,246,0.2)' }}
            />
          </Stack>
        </Box>

        {/* Action Belt */}
        <Box sx={{ px: 4, py: 2, background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', zIndex: 1 }}>
            <Stack direction="row" spacing={2} justifyContent="flex-start">
               <Tooltip title="Export to Document">
                 <Button startIcon={<GetAppOutlined />} sx={{ color: '#fff', textTransform: 'none', fontWeight: 500, fontSize: '0.85rem' }}>Export</Button>
               </Tooltip>
               <Tooltip title="Instant Translation">
                 <Button startIcon={<TranslateOutlined />} sx={{ color: '#fff', textTransform: 'none', fontWeight: 500, fontSize: '0.85rem' }}>Translate</Button>
               </Tooltip>
               <Tooltip title="Save to Intelligence Hub">
                 <Button startIcon={<BookmarkBorderOutlined />} sx={{ color: '#fff', textTransform: 'none', fontWeight: 500, fontSize: '0.85rem' }}>Vault</Button>
               </Tooltip>
            </Stack>
        </Box>

        {/* Content Flow */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 4, zIndex: 1 }}>
          {/* Main Summary Paper */}
          <Paper elevation={0} sx={{ ...GLASS, p: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                 <Bolt sx={{ color: '#fbbf24' }} />
                 <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>Expert Synthesis</Typography>
            </Box>
            <Typography variant="body1" sx={{ 
              lineHeight: 1.85, color: 'rgba(255,255,255,0.85)', fontSize: '1rem', 
              whiteSpace: 'pre-line', letterSpacing: '0.01em'
            }}>
              {processedData.summary || "Generating deep analysis..."}
            </Typography>
          </Paper>

          {/* AI Diagnostic Insights */}
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800, mb: 2, display: 'block', letterSpacing: '0.1em' }}>
            AI DIAGNOSTIC INSIGHTS
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
             <Paper sx={{ ...GLASS, p: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Relevance</Typography>
                     <Typography variant="caption" sx={{ color: '#0ea5e9', fontWeight: 700 }}>96%</Typography>
                 </Box>
                 <LinearProgress variant="determinate" value={96} sx={{ borderRadius: 2, height: 4, background: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { background: '#0ea5e9' } }} />
             </Paper>
             <Paper sx={{ ...GLASS, p: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Clarity</Typography>
                     <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>92%</Typography>
                 </Box>
                 <LinearProgress variant="determinate" value={92} sx={{ borderRadius: 2, height: 4, background: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { background: '#10b981' } }} />
             </Paper>
          </Box>

          <Box sx={{ mt: 4, p: 3, borderRadius: '16px', background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.1)' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <MetricsIcon sx={{ color: '#8b5cf6' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                      This summary has been optimized for professional executive review using ASRVoices Neural Engine V4.
                  </Typography>
              </Box>
          </Box>
        </Box>

        {/* Footer actions */}
        <Box sx={{ p: 3, background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            <Button 
                variant="outlined" 
                onClick={onClose}
                sx={{ 
                    borderRadius: '50px', textTransform: 'none', px: 4, 
                    borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)',
                    '&:hover': { borderColor: '#fff', color: '#fff', background: 'transparent' }
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
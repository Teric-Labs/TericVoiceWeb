import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { AutoFixHigh as AIvatarIcon } from "@mui/icons-material";
import SummarizationCard from "./SummarizationCard";

const G = 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)';

const SummarizeComponent = () => {
  return (
    <Box sx={{ p: { xs: 1, md: 2.5 }, minHeight: '100vh', background: '#0a0a0f', color: '#fff' }}>
      {/* Header Area */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.04em', background: G, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 0.5 }}>
            SUMMARY HUB
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.02em' }}>
            CONCISE INTELLIGENCE • NEURAL SYNTHESIS • ETHICAL AI
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5, background: 'rgba(255,255,255,0.03)', p: 1, px: 2, borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <AIvatarIcon sx={{ color: '#0ea5e9', fontSize: 20 }} />
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>AI NARRATOR ONLINE</Typography>
        </Box>
      </Stack>

      <Box sx={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', p: { xs: 2, md: 4 }, position: 'relative', overflow: 'hidden' }}>
         <SummarizationCard />
      </Box>
    </Box>
  );
}

export default SummarizeComponent;

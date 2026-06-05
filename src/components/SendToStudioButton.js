import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Typography, Tooltip } from '@mui/material';
import {
  SendOutlined as SendIcon,
  Translate as TranslateIcon,
  RecordVoiceOver as SynthIcon,
  GraphicEq as VoiceoverIcon,
  Movie as DubbingIcon,
  ArrowForward,
} from '@mui/icons-material';
import { sendToStudio, STUDIO_ROUTES } from '../utils/pipelineHandoff';

const AC = '#E8A020';

const TARGET_META = {
  translate: { label: 'Translate', desc: 'Translate this text', icon: <TranslateIcon fontSize="small" />, color: '#10b981' },
  synthesize: { label: 'Synthesize', desc: 'Turn text into speech', icon: <SynthIcon fontSize="small" />, color: '#C47F10' },
  voiceover: { label: 'Voiceover', desc: 'Narrate as a voiceover', icon: <VoiceoverIcon fontSize="small" />, color: '#ec4899' },
  dubbing: { label: 'Video Dubbing', desc: 'Dub a video in this language', icon: <DubbingIcon fontSize="small" />, color: '#3b82f6' },
};

/**
 * "Send to →" dropdown that hands the current result off to another studio.
 *
 * Props:
 *  - targets: ordered array of target ids ('translate' | 'synthesize' | 'voiceover' | 'dubbing')
 *  - getPayload: () => ({ text, sourceLang, targetLang, ... }) built lazily on click
 *  - variant / size / sx: forwarded to the trigger Button
 *  - label: trigger text (default "Send to")
 */
export default function SendToStudioButton({
  targets = ['translate', 'synthesize'],
  getPayload,
  label = 'Send to',
  variant = 'outlined',
  size = 'small',
  disabled = false,
  sx,
}) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handlePick = (target) => {
    setAnchorEl(null);
    const payload = (typeof getPayload === 'function' ? getPayload() : getPayload) || {};
    sendToStudio(target, payload);
    navigate(STUDIO_ROUTES[target]);
  };

  const items = targets.filter(t => TARGET_META[t] && STUDIO_ROUTES[t]);
  if (items.length === 0) return null;

  return (
    <>
      <Tooltip
        title="Continue your workflow — hand this result straight to another studio without re-uploading or copy-pasting."
        placement="top"
        arrow
        componentsProps={{ tooltip: { sx: { bgcolor: '#111', fontSize: '0.74rem', fontWeight: 500, lineHeight: 1.55, p: 1.25, borderRadius: '10px', maxWidth: 250, '& .MuiTooltip-arrow': { color: '#111' } } } }}
      >
        <Button
          variant={variant}
          size={size}
          disabled={disabled}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          startIcon={<SendIcon fontSize="small" />}
          sx={{
            textTransform: 'none', fontWeight: 800, borderRadius: '10px',
            borderColor: `${AC}66`, color: AC,
            '&:hover': { borderColor: AC, background: 'rgba(232,160,32,0.08)' },
            ...sx,
          }}
        >
          {label}
        </Button>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { borderRadius: '14px', minWidth: 240, mt: 0.5, boxShadow: '0 14px 40px rgba(17,17,17,0.16)' } } }}
      >
        <Typography sx={{ px: 2, pt: 1.25, pb: 0.5, fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(17,17,17,0.4)' }}>
          Continue in
        </Typography>
        <Divider sx={{ mb: 0.5 }} />
        {items.map((t) => {
          const m = TARGET_META[t];
          return (
            <MenuItem key={t} onClick={() => handlePick(t)} sx={{ py: 1.1, px: 2, '&:hover': { background: 'rgba(232,160,32,0.06)' } }}>
              <ListItemIcon sx={{ color: m.color, minWidth: 34 }}>{m.icon}</ListItemIcon>
              <ListItemText
                primary={m.label}
                secondary={m.desc}
                primaryTypographyProps={{ fontWeight: 700, fontSize: '0.85rem', color: '#111111' }}
                secondaryTypographyProps={{ fontSize: '0.7rem', color: 'rgba(17,17,17,0.45)' }}
              />
              <ArrowForward sx={{ fontSize: 15, color: 'rgba(17,17,17,0.25)', ml: 1 }} />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

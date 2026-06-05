import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton, Badge, Popover, Box, Typography, Stack, Avatar, Button, Tooltip,
} from '@mui/material';
import {
  NotificationsNone as NotificationsNoneIcon,
  SettingsVoice as TranscribeIcon,
  Translate as TranslateIcon,
  RecordVoiceOver as SynthIcon,
  Notes as SummarizeIcon,
  Movie as DubbingIcon,
  GraphicEq as VoiceoverIcon,
  AutoAwesome,
  DoneAll as DoneAllIcon,
} from '@mui/icons-material';
import {
  fetchAllVaultActivity, readAllVaultActivityCache,
  isProcessingStatus, formatRelativeDate,
} from '../utils/mediaVault';

const GOLD = '#E8A020';
const SEEN_KEY = 'avoices_notif_last_seen';

const TYPE_ICON = {
  transcription: <TranscribeIcon sx={{ fontSize: 18 }} />,
  video: <TranscribeIcon sx={{ fontSize: 18 }} />,
  translation: <TranslateIcon sx={{ fontSize: 18 }} />,
  tts: <SynthIcon sx={{ fontSize: 18 }} />,
  document_tts: <SynthIcon sx={{ fontSize: 18 }} />,
  summary: <SummarizeIcon sx={{ fontSize: 18 }} />,
  dubbing: <DubbingIcon sx={{ fontSize: 18 }} />,
  voiceover: <VoiceoverIcon sx={{ fontSize: 18 }} />,
  vox: <SynthIcon sx={{ fontSize: 18 }} />,
};

function statusMeta(row) {
  if (isProcessingStatus(row._status)) return { label: 'is processing', color: '#d97706', dot: '#f59e0b' };
  if (row._status === 'failed') return { label: 'failed', color: '#ef4444', dot: '#ef4444' };
  return { label: 'is ready', color: '#10b981', dot: '#10b981' };
}

export default function NotificationCenter({ userId }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activity, setActivity] = useState(() => (userId ? readAllVaultActivityCache(userId) || [] : []));
  const [lastSeen, setLastSeen] = useState(() => Number(localStorage.getItem(SEEN_KEY) || 0));

  const load = useCallback(async ({ force = false } = {}) => {
    if (!userId) return;
    try {
      const rows = await fetchAllVaultActivity(userId, { force });
      setActivity(Array.isArray(rows) ? rows : []);
    } catch {
      /* keep cached */
    }
  }, [userId]);

  useEffect(() => {
    load();
    const onUpdate = () => load({ force: true });
    window.addEventListener('library-updated', onUpdate);
    return () => window.removeEventListener('library-updated', onUpdate);
  }, [load]);

  const items = useMemo(() => activity.slice(0, 12), [activity]);

  const unseen = useMemo(
    () => activity.filter(r => {
      const t = new Date(r._date || 0).getTime();
      return !Number.isNaN(t) && t > lastSeen;
    }).length,
    [activity, lastSeen]
  );

  const open = Boolean(anchorEl);

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
    load({ force: true });
  };

  const markAllSeen = useCallback(() => {
    const newest = activity.reduce((max, r) => {
      const t = new Date(r._date || 0).getTime();
      return Number.isNaN(t) ? max : Math.max(max, t);
    }, Date.now());
    localStorage.setItem(SEEN_KEY, String(newest));
    setLastSeen(newest);
  }, [activity]);

  const handleClose = () => {
    markAllSeen();
    setAnchorEl(null);
  };

  const handleItemClick = (row) => {
    handleClose();
    if (row._viewPath) navigate(row._viewPath);
    else if (row._studioPath) navigate(row._studioPath);
    else navigate('/dashboard/history');
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton onClick={handleOpen} sx={{ color: 'rgba(17,17,17,0.55)', '&:hover': { color: GOLD } }}>
          <Badge badgeContent={unseen} color="error" max={9} overlap="circular"
            sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16, fontWeight: 800 } }}>
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 380, maxWidth: '92vw', borderRadius: '16px', mt: 1, boxShadow: '0 18px 50px rgba(17,17,17,0.18)', overflow: 'hidden' } } }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2.25, py: 1.75, borderBottom: '1px solid rgba(17,17,17,0.06)' }}>
          <Typography sx={{ fontWeight: 800, color: '#111111', fontSize: '0.95rem' }}>Notifications</Typography>
          {unseen > 0 && (
            <Button size="small" startIcon={<DoneAllIcon sx={{ fontSize: 16 }} />} onClick={markAllSeen}
              sx={{ textTransform: 'none', fontWeight: 700, color: GOLD, fontSize: '0.75rem' }}>
              Mark all read
            </Button>
          )}
        </Stack>

        {items.length === 0 ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <AutoAwesome sx={{ fontSize: 38, color: 'rgba(17,17,17,0.15)', mb: 1.25 }} />
            <Typography sx={{ fontWeight: 700, color: '#111111', fontSize: '0.9rem' }}>You're all caught up</Typography>
            <Typography sx={{ fontSize: '0.78rem', color: 'rgba(17,17,17,0.45)', mt: 0.5 }}>
              New projects and finished jobs show up here.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 420, overflowY: 'auto' }}>
            {items.map((row, i) => {
              const meta = statusMeta(row);
              const t = new Date(row._date || 0).getTime();
              const fresh = !Number.isNaN(t) && t > lastSeen;
              return (
                <Stack
                  key={row.doc_id || i}
                  direction="row" spacing={1.5} alignItems="center"
                  onClick={() => handleItemClick(row)}
                  sx={{
                    px: 2.25, py: 1.5, cursor: 'pointer',
                    background: fresh ? 'rgba(232,160,32,0.05)' : 'transparent',
                    borderBottom: '1px solid rgba(17,17,17,0.04)',
                    transition: 'background 0.15s',
                    '&:hover': { background: 'rgba(232,160,32,0.08)' },
                  }}
                >
                  <Avatar variant="rounded" sx={{ width: 34, height: 34, bgcolor: `${row._vaultColor || GOLD}18`, color: row._vaultColor || GOLD, borderRadius: '10px' }}>
                    {TYPE_ICON[row._vaultType] || <AutoAwesome sx={{ fontSize: 18 }} />}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.82rem', color: '#111111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <strong>{row._title || 'Untitled'}</strong>{' '}
                      <span style={{ color: meta.color, fontWeight: 600 }}>{meta.label}</span>
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: 'rgba(17,17,17,0.45)', fontWeight: 600 }}>
                      {row._vaultLabel} · {formatRelativeDate(row._date)}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: meta.dot, flexShrink: 0 }} />
                </Stack>
              );
            })}
          </Box>
        )}

        <Box sx={{ p: 1.25, borderTop: '1px solid rgba(17,17,17,0.06)' }}>
          <Button fullWidth onClick={() => { handleClose(); navigate('/dashboard/history'); }}
            sx={{ textTransform: 'none', fontWeight: 700, color: '#111111', borderRadius: '10px', '&:hover': { background: 'rgba(232,160,32,0.08)', color: GOLD } }}>
            View all activity
          </Button>
        </Box>
      </Popover>
    </>
  );
}

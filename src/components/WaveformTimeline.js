import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Stack, IconButton, Typography, Chip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';

const AC = '#E8A020';

function fmt(t) {
  if (!Number.isFinite(t) || t < 0) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Waveform + segment timeline (Descript/HeyGen-style) built on wavesurfer.js.
 *
 * Props:
 *  - url:        audio or video URL to visualize/play
 *  - video:      when true, renders a <video> element and binds wavesurfer to it
 *  - segments:   [{ start, end, text, label }] in seconds (regions drawn when timed)
 *  - height:     waveform height (px)
 *  - emptyLabel: text shown when there are no segments
 *
 * Degrades gracefully: if the waveform can't decode (e.g. CORS), it falls back
 * to a native <audio>/<video> element so playback always works.
 */
export default function WaveformTimeline({ url, video = false, segments = [], height = 88, emptyLabel }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const wsRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [failed, setFailed] = useState(false);

  const timed = segments.filter(s => Number(s.end) > Number(s.start));
  const hasTimes = timed.length > 0;

  useEffect(() => {
    if (!containerRef.current || !url) return undefined;
    let ws;
    let cancelled = false;
    try {
      const regions = RegionsPlugin.create();
      const opts = {
        container: containerRef.current,
        waveColor: 'rgba(17,17,17,0.18)',
        progressColor: AC,
        cursorColor: AC,
        barWidth: 2,
        barGap: 1,
        barRadius: 3,
        height,
        normalize: true,
        plugins: [regions],
      };
      if (video && videoRef.current) opts.media = videoRef.current;
      else opts.url = url;

      ws = WaveSurfer.create(opts);
      wsRef.current = ws;

      ws.on('ready', () => {
        if (cancelled) return;
        setReady(true);
        setDuration(ws.getDuration());
        timed.forEach((s, i) => {
          regions.addRegion({
            start: Number(s.start),
            end: Number(s.end),
            drag: false,
            resize: false,
            color: `rgba(232,160,32,${i % 2 ? 0.10 : 0.18})`,
          });
        });
      });
      ws.on('timeupdate', (t) => {
        setCurrent(t);
        if (hasTimes) setActiveIdx(segments.findIndex(s => t >= Number(s.start) && t <= Number(s.end)));
      });
      ws.on('play', () => setPlaying(true));
      ws.on('pause', () => setPlaying(false));
      ws.on('finish', () => setPlaying(false));
      ws.on('error', () => setFailed(true));
      regions.on('region-clicked', (region, e) => {
        e.stopPropagation();
        ws.setTime(region.start);
        ws.play();
      });
    } catch {
      setFailed(true);
    }
    return () => {
      cancelled = true;
      try { if (ws) ws.destroy(); } catch { /* already torn down */ }
      wsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, video, height]);

  const togglePlay = useCallback(() => {
    const ws = wsRef.current;
    if (ws && !failed) ws.playPause();
  }, [failed]);

  const seekTo = useCallback((sec) => {
    const ws = wsRef.current;
    if (ws && !failed) {
      ws.setTime(sec);
      ws.play();
    } else if (videoRef.current) {
      videoRef.current.currentTime = sec;
      videoRef.current.play();
    }
  }, [failed]);

  return (
    <Box>
      {video && (
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', md: 920 },
            mx: 'auto',
            mb: 2,
            borderRadius: '18px',
            overflow: 'hidden',
            background: '#0a0a0a',
            border: '1px solid rgba(232,160,32,0.18)',
            boxShadow: '0 20px 56px rgba(17,17,17,0.16)',
          }}
        >
          <Box sx={{ position: 'relative', width: '100%', pt: '56.25%', background: '#000' }}>
            <video
              ref={videoRef}
              src={url}
              controls
              playsInline
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                background: '#000',
              }}
            />
          </Box>
        </Box>
      )}

      {/* Waveform strip */}
      {!failed && (
        <Box sx={{ borderRadius: '14px', border: '1px solid rgba(17,17,17,0.07)', background: 'rgba(17,17,17,0.02)', p: 1.5, mb: hasTimes ? 2 : 0 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {!video && (
              <IconButton onClick={togglePlay} disabled={!ready} sx={{ background: AC, color: '#111', width: 40, height: 40, flexShrink: 0, '&:hover': { background: '#C47F10' }, '&.Mui-disabled': { background: 'rgba(17,17,17,0.1)' } }}>
                {playing ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
            )}
            <Box sx={{ flex: 1, minWidth: 0 }} ref={containerRef} />
            <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(17,17,17,0.55)', flexShrink: 0, minWidth: 78, textAlign: 'right' }}>
              {fmt(current)} / {fmt(duration)}
            </Typography>
          </Stack>
        </Box>
      )}

      {failed && !video && (
        <audio controls src={url} style={{ width: '100%' }} />
      )}

      {/* Segment list */}
      {hasTimes && (
        <Stack spacing={0.75} sx={{ maxHeight: 360, overflowY: 'auto', pr: 0.5 }}>
          {segments.map((s, i) => {
            const isActive = i === activeIdx;
            const isTimed = Number(s.end) > Number(s.start);
            return (
              <Stack
                key={i}
                direction="row"
                spacing={1.25}
                alignItems="flex-start"
                onClick={() => isTimed && seekTo(Number(s.start))}
                sx={{
                  p: 1.25,
                  borderRadius: '10px',
                  cursor: isTimed ? 'pointer' : 'default',
                  background: isActive ? 'rgba(232,160,32,0.12)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(232,160,32,0.35)' : 'rgba(17,17,17,0.05)'}`,
                  transition: 'background 0.15s, border-color 0.15s',
                  '&:hover': { background: isTimed ? 'rgba(232,160,32,0.07)' : 'transparent' },
                }}
              >
                <Chip
                  label={fmt(Number(s.start))}
                  size="small"
                  sx={{ height: 20, fontSize: '0.62rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', bgcolor: isActive ? AC : 'rgba(17,17,17,0.06)', color: isActive ? '#111' : 'rgba(17,17,17,0.6)', flexShrink: 0, mt: 0.2 }}
                />
                <Typography sx={{ fontSize: '0.84rem', color: '#111111', lineHeight: 1.5 }}>
                  {s.text || s.label || `Segment ${i + 1}`}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      )}

      {!hasTimes && emptyLabel && (
        <Typography sx={{ fontSize: '0.78rem', color: 'rgba(17,17,17,0.4)', mt: 1.5 }}>{emptyLabel}</Typography>
      )}
    </Box>
  );
}

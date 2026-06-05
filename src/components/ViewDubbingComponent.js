import React, { useEffect, useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import MovieIcon from '@mui/icons-material/Movie';
import { useNavigate } from 'react-router-dom';
import { dataAPI } from '../services/api';
import { ResultViewLayout, ResultSection, rvPrimaryButtonSx } from './result-view';
import WaveformTimeline from './WaveformTimeline';

const ViewDubbingComponent = ({ dubbingId }) => {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        let found = null;
        try {
          const data = await dataAPI.getDubbedVideo(dubbingId);
          found = data?.entry || null;
        } catch {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const uid = user.uid || user.userId;
          const list = await dataAPI.getDubbedVideos(uid);
          found = (list?.entries || []).find(e => e.doc_id === dubbingId) || null;
        }
        if (active) setEntry(found);
      } catch {
        if (active) setSnackbar({ open: true, message: 'Failed to load dubbing project' });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [dubbingId]);

  const videoUrl = entry?.dubbed_video_url || entry?.slideshow_url || entry?.video_url || null;
  const isSlideshow = entry?.type === 'image_slideshow';
  const segments = Array.isArray(entry?.segments) ? entry.segments : [];
  const timelineSegments = segments.map(s => ({
    start: (s.start_time_ms != null ? s.start_time_ms / 1000 : s.start_time) || 0,
    end: (s.end_time_ms != null ? s.end_time_ms / 1000 : s.end_time) || 0,
    text: s.text || s.translated || '',
  }));

  const handleDownload = () => {
    if (!videoUrl) return;
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = '';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSnackbar({ open: true, message: 'Download started' });
  };

  return (
    <>
      <ResultViewLayout
        type="dubbing"
        title={entry?.title || entry?.video_filename || 'Video Dubbing'}
        subtitle={isSlideshow ? 'Image Slideshow' : 'Video Dubbing'}
        date={entry?.date}
        onBack={() => navigate(-1)}
        loading={loading}
        empty={!loading && !entry}
        emptyMessage="Dubbing project not found"
        emptyIcon={MovieIcon}
        badges={[
          entry?.status && { label: entry.status === 'completed' ? 'Completed' : entry.status },
          segments.length && { label: `${segments.length} segments` },
          entry?.credits_used != null && { label: `${Number(entry.credits_used).toFixed(1)} credits` },
        ].filter(Boolean)}
        headerActions={videoUrl && (
          <Button startIcon={<CloudDownloadIcon />} onClick={handleDownload} sx={rvPrimaryButtonSx}>
            Download
          </Button>
        )}
      >
        {videoUrl && (
          <ResultSection title="Output & Timeline">
            <WaveformTimeline
              url={videoUrl}
              video
              segments={timelineSegments}
              emptyLabel="No timed segments for this project."
            />
          </ResultSection>
        )}
      </ResultViewLayout>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ open: false, message: '' })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="info" onClose={() => setSnackbar({ open: false, message: '' })} sx={{ borderRadius: '12px' }}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default ViewDubbingComponent;

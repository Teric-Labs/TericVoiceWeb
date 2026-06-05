# VoiceoverStudio BGM Integration Update

## Overview
This document outlines the integration of background music (BGM) selection and preview features into the VoiceoverStudio component for both Narration Mode and Slideshow Mode.

## Changes Required

### 1. New Imports
Already added to VoiceoverStudio.js:
- `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions` from @mui/material
- `Pause as PauseIcon`, `VolumeOff as VolumeOffIcon` from @mui/icons-material

### 2. New State Variables (Added to component)
```javascript
// Background Music (BGM) additions
const [enableBGM, setEnableBGM]             = useState(false);
const [bgmTracks, setBgmTracks]             = useState([]);
const [selectedBGM, setSelectedBGM]         = useState(null);
const [bgmVolume, setBgmVolume]             = useState(0.3);
const [bgmDialogOpen, setBgmDialogOpen]     = useState(false);
const [previewingTrackId, setPreviewingTrackId] = useState(null);
const [bgmLoading, setBgmLoading]           = useState(false);
```

### 3. New Components (Added)

#### BGMCard Component
- Displays individual BGM track information
- Shows track name, mood, duration, and BPM
- Includes "Play Sample" button for preview
- Highlights selected track
- Mood-based color coding

#### BGMSelectionDialog Component
- Modal dialog for browsing all available BGM tracks
- Grid layout showing all 5 tracks (Corporate, Ambient, Upbeat, Cinematic, Lo-Fi)
- Audio preview capability with play/pause
- Selection callback handler
- Cancel/Done buttons

### 4. New useEffect Hook (Added)
```javascript
// Load BGM tracks on component mount
useEffect(() => {
  const loadBGMTracks = async () => {
    setBgmLoading(true);
    try {
      const response = await fetch('/api/bgm-tracks');
      if (response.ok) {
        const data = await response.json();
        setBgmTracks(data.tracks || []);
        if (data.tracks && data.tracks.length > 0) {
          setSelectedBGM(data.tracks[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load BGM tracks:', err);
    } finally {
      setBgmLoading(false);
    }
  };
  
  loadBGMTracks();
}, []);
```

## UI Placement

### Location 1: Between Mode Selection and Stepper
Add a BGM Control Panel after the Mode Selection buttons and before the Stepper:

```jsx
{/* BGM Control Panel */}
<Paper elevation={0} sx={{ p: 2.5, mb: 3, ...GLASS }}>
  <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} justifyContent="space-between">
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <MusicNote sx={{ fontSize: 22, color: AC }} />
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#111111' }}>
          Background Music
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', color: 'rgba(17, 17, 17, 0.5)', mt: 0.25 }}>
          Add royalty-free music to enhance your {mode === 'slideshow' ? 'slideshow' : 'narration'}
        </Typography>
      </Box>
    </Stack>
    
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
      {/* Enable/Disable Toggle */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <Switch
          checked={enableBGM}
          onChange={(e) => setEnableBGM(e.target.checked)}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: AC,
              '& + .MuiSwitch-track': {
                backgroundColor: AC,
                opacity: 0.3,
              }
            }
          }}
        />
        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: enableBGM ? AC : 'rgba(17, 17, 17, 0.4)' }}>
          {enableBGM ? 'BGM Enabled' : 'Add Music'}
        </Typography>
      </Stack>
      
      {/* Open BGM Selector */}
      {enableBGM && (
        <>
          <Box sx={{
            p: 1.5,
            borderRadius: '10px',
            background: selectedBGM ? `${AC}12` : 'rgba(17, 17, 17, 0.04)',
            border: `1px solid ${selectedBGM ? `${AC}30` : 'rgba(17, 17, 17, 0.08)'}`,
            minWidth: 200,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onClick={() => setBgmDialogOpen(true)}>
            {selectedBGM ? (
              <Stack spacing={0.5}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: '#111111' }}>
                  ♪ {selectedBGM.name}
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: 'rgba(17, 17, 17, 0.5)' }}>
                  {selectedBGM.mood}
                </Typography>
              </Stack>
            ) : (
              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'rgba(17, 17, 17, 0.4)' }}>
                Select a track…
              </Typography>
            )}
          </Box>
          
          {/* Volume Control */}
          <Box sx={{ minWidth: 220 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <VolumeOffIcon sx={{ fontSize: 16, color: 'rgba(17, 17, 17, 0.3)' }} />
              <Slider
                value={bgmVolume}
                min={0}
                max={1}
                step={0.05}
                onChange={(_, v) => setBgmVolume(v)}
                sx={{
                  flex: 1,
                  height: 3,
                  color: AC,
                  '& .MuiSlider-thumb': { width: 12, height: 12 }
                }}
              />
              <VolumeUp sx={{ fontSize: 16, color: AC }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: AC, minWidth: 30 }}>
                {Math.round(bgmVolume * 100)}%
              </Typography>
            </Stack>
          </Box>
        </>
      )}
    </Stack>
  </Stack>
</Paper>

{/* BGM Selection Dialog */}
<BGMSelectionDialog
  open={bgmDialogOpen}
  onClose={() => setBgmDialogOpen(false)}
  onSelect={(track) => {
    setSelectedBGM(track);
    setBgmDialogOpen(false);
  }}
  selectedTrackId={selectedBGM?.id}
  bgmTracks={bgmTracks}
  onPreview={setPreviewingTrackId}
  previewingTrackId={previewingTrackId}
/>
```

### Location 2: In Step 4 (Generate Audio)
Update the generateAll function to include BGM when enabled:

```javascript
if (enableBGM && selectedBGM) {
  payload.bgm_track_id = selectedBGM.id;
  payload.bgm_volume = bgmVolume;
}
```

## API Integration

### Backend Endpoints Used
1. **GET /api/bgm-tracks** - Fetches available BGM tracks
   - Response includes track metadata (id, name, filename, duration, bpm, mood, source)
   
2. **GET /bgm-stream/{filename}** - Streams BGM audio for preview
   - Used in BGMCard component for play sample functionality

### Data Sent to Generation Endpoints
When generating narration or slideshow with BGM:
```javascript
{
  segments: [...],
  bgm_track_id: "corporate",      // Selected BGM track ID
  bgm_volume: 0.3,                // Volume level (0-1)
  apply_effects: true             // For slideshow mode
}
```

## Features Implemented

### 1. BGM Enable/Disable Toggle
- Switch to activate/deactivate background music
- Shows "BGM Enabled" or "Add Music" text based on state

### 2. BGM Track Selection
- Dialog with grid layout of all 5 available tracks
- Shows track name, mood, duration, and BPM
- Color-coded by mood (Professional, Calm, Energetic, Epic, Relaxed)

### 3. Audio Preview
- "Play Sample" button on each track card
- Plays 15-30 second sample of track
- Play/Stop toggle during preview
- Preview stops automatically when dialog closes

### 4. Volume Control
- Slider to adjust BGM volume (0-100%)
- Real-time percentage display
- Default volume: 30% (to not overpower voiceover)

### 5. Track Information
- Track name
- Mood description
- Duration in seconds
- Tempo (BPM)
- Source attribution

### 6. Visual Feedback
- Selected track highlighted with orange border and background
- Hovering on track cards shows tooltip
- Currently playing preview indicated with pause icon

## Testing Checklist

- [ ] Load VoiceoverStudio component
- [ ] Verify BGM tracks load from /api/bgm-tracks
- [ ] Test toggle enable/disable BGM
- [ ] Click "Select a track…" to open dialog
- [ ] Verify all 5 tracks display
- [ ] Test "Play Sample" button on each track
- [ ] Verify audio plays and stops correctly
- [ ] Test volume slider (0-100%)
- [ ] Select different tracks and verify UI updates
- [ ] Test in both Narration and Slideshow modes
- [ ] Generate narration/slideshow with BGM enabled
- [ ] Verify BGM parameters sent to backend
- [ ] Test with BGM disabled

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Notes
- BGM tracks loaded on component mount (async)
- Preview audio loaded on-demand when play button clicked
- Audio URLs generated dynamically using blob URLs
- Memory cleanup on component unmount and preview stop

## File Size
- Original VoiceoverStudio.js: ~953 lines
- BGM Components added: ~200 lines
- New total: ~1153 lines
- Added CSS animations for BGM cards

## Backward Compatibility
- No breaking changes to existing API
- BGM is optional feature (disabled by default)
- Existing narration/slideshow generation works unchanged
- New parameters ignored if backend doesn't support BGM

## Future Enhancements
- User-uploaded custom BGM tracks
- Per-segment BGM volume control
- Crossfade transitions for BGM
- Multiple BGM track layering
- BGM search/filter by mood or tempo
- Favorites/bookmarks for BGM tracks

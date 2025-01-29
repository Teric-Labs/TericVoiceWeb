import React from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import {
  useTheme
} from "@mui/material";
const AudioPlayerComponent = ({ audioSrc, onTimeUpdate }) => {
  const theme = useTheme();

  const styles = {
    audioPlayer: {
      borderRadius: "12px",
      backgroundColor: "rgba(25, 118, 210, 0.04)",
      "& .rhap_main-controls-button": {
        color: theme.palette.primary.main,
      },
      "& .rhap_progress-filled": {
        backgroundColor: theme.palette.primary.main,
      },
      "& .rhap_download-progress": {
        backgroundColor: theme.palette.primary.light,
      },
    }
   
  };
  return (
    <AudioPlayer
      src={audioSrc}
      onPlay={() => console.log("Playing audio...")}
      onListen={(e) => onTimeUpdate(e.target.currentTime)} // Fires every time the audio updates
      onError={(error) => console.error("Audio error:", error)}
      style={styles.audioPlayer}
      customVolumeControls={[]}
      customAdditionalControls={[]}
      showJumpControls={false}
    />
  );
};

export default AudioPlayerComponent;

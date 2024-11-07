import React from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const AudioPlayerComponent = ({ audioSrc, onTimeUpdate }) => {
  return (
    <AudioPlayer
      src={audioSrc}
      onPlay={() => console.log("Playing audio...")}
      onListen={(e) => onTimeUpdate(e.target.currentTime)} // Fires every time the audio updates
      onError={(error) => console.error("Audio error:", error)}
    />
  );
};

export default AudioPlayerComponent;

import React, { useRef, useState, useEffect } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const AudioPlayerComponent = ({ audioSrc }) => {

  return (
    <div>
      <div>Audio URL: {audioSrc}</div>
      <AudioPlayer
        src={audioSrc}
        onPlay={() => console.log("OnPlay")}
        onError={(error) => console.error("Audio error:", error)}
      />
    </div>
  );
};

export default AudioPlayerComponent;

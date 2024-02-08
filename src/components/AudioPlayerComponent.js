import React, { useRef, useState, useEffect } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const AudioPlayerComponent = ({ audioSrc: audioUrl }) => {
  const [audioSrc, setAudioSrc] = useState('');
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    if (!audioUrl) {
      console.error('Audio URL is undefined');
      return;
    }

    console.log("Fetching audio:", audioUrl);

    fetch(audioUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        console.log("Created URL:", url);
        setAudioSrc(url);

        try {
          if (audioPlayerRef.current && audioPlayerRef.current.audio.current) {
            audioPlayerRef.current.audio.current.play();
          }
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      })
      .catch(error => {
        console.error('Error fetching or processing audio:', error);
      });
  }, [audioUrl]);

  return (
    <div>
      <div>Audio URL: {audioUrl}</div>
      <AudioPlayer
        ref={audioPlayerRef}
        src={audioSrc}
        onPlay={() => console.log("OnPlay")}
        onError={(error) => console.error("Audio error:", error)}
      />
    </div>
  );
};

export default AudioPlayerComponent;

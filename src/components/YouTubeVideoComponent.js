import React, { useEffect } from 'react';
import YouTube from 'react-youtube';

const YouTubeVideoComponent = ({ videoUrl, onTimeUpdate }) => {
  let player;

  const onPlayerReady = (event) => {
    player = event.target;
    startTrackingTime();
  };

  const startTrackingTime = () => {
    setInterval(() => {
      if (player && player.getPlayerState() === YouTube.PlayerState.PLAYING) {
        const currentTime = player.getCurrentTime();
        onTimeUpdate(currentTime);
      }
    }, 1000); // Update every second
  };

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };

  return <YouTube videoId={extractVideoID(videoUrl)} opts={opts} onReady={onPlayerReady} />;
};

// Helper function to extract YouTube video ID
const extractVideoID = (url) => {
  const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/[^/]+|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^?&"'>]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

export default YouTubeVideoComponent;

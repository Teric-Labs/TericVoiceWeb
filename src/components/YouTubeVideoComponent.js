import React from 'react';
import YouTube from 'react-youtube';

const YouTubeVideoComponent = ({ videoUrl }) => {
  const videoId = extractVideoID(videoUrl);

  // Options for the YouTube player
  const opts = {
    height: '390',
    width: '640',  
    playerVars: {
      autoplay: 1,  
    },
  };

  return <YouTube videoId={videoId} opts={opts} onReady={onPlayerReady} />;
};

const extractVideoID = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11) ? match[2] : null;
};

const onPlayerReady = (event) => {
  event.target.pauseVideo(); 
};

export default YouTubeVideoComponent;

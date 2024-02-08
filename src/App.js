import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import LiveStream from "./views/Livestream";
import VideoStream from "./views/Videostream";
import Transcribe from "./views/Transcribe";
import Sidenav from "./components/Sidenav";
import Translation from "./views/Translation";
import Text2Speech from "./views/Text2Speech";
import ViewVideo from "./views/ViewVideo"
import ViewAudio from "./views/ViewAudio";
import Voice2Voice from "./views/Voice2Voice";

function App() {
  return (
    <Router>
      <Sidenav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/livestream" element={<LiveStream />} />
          <Route path="/videostream" element={<VideoStream />} />
          <Route path="/transcribe" element={<Transcribe />} />
          <Route path="/synthesize" element={<Text2Speech />} />
          <Route path="/translate" element={<Translation />} />
          <Route path="/translate" element={<Translation />} />
          <Route path="/audio" element={<ViewAudio />} />
          <Route path="/video" element={<ViewVideo />} />
          <Route path="/voice" element={<Voice2Voice />} />
        </Routes>
        </Sidenav>
    </Router>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import LiveStream from "./views/Livestream";
import VideoStream from "./views/Videostream";
import Transcribe from "./views/Transcribe";
import Sidenav from "./components/Sidenav";
import Translation from "./views/Translation";
import Text2Speech from "./views/Text2Speech";

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
        </Routes>
        </Sidenav>
    </Router>
  );
}

export default App;

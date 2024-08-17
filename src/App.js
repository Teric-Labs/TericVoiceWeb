import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import Dashboard from "./views/Dashboard";
import LiveStream from "./views/Livestream";
import VideoStream from "./views/Videostream";
import Transcribe from "./views/Transcribe";
import Sidenav from "./components/Sidenav";
import Translation from "./views/Translation";
import Text2Speech from "./views/Text2Speech";
import ViewVideo from "./views/ViewVideo";
import ViewAudio from "./views/ViewAudio";
import Voice2Voice from "./views/Voice2Voice";
import ViewttsAudio from "./views/ViewttsAudio";
import ViewTranslations from "./views/ViewTranslations";
import VoiceLingo from "./views/VoiceLingo";
import ViewVoxTrans from "./views/ViewVoxTrans";
import Summarization from "./views/Summarization";
import ViewSummary from "./views/ViewSummary";
import Home from "./views/Home";
import GetStarted from "./views/GetStarted";
import ContactSupport from "./views/ContactSupport";
import { AuthProvider,useAuth } from "./components/AuthContext";
import Pricing from "./views/Pricing";
import Subscription from "./views/Subscription";
import APIReference from "./views/APIReference";
import APis from "./views/APis";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate replace to="/" />;
};

function App() {
  
  return (
   <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/documentation" element={<APis />} />
        <Route path="/api-reference" element={<APIReference />} />
        <Route path="/dashboard" element={<PrivateRoute><Sidenav/></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="livestream" element={<LiveStream />} />
          <Route path="videostream" element={<VideoStream />} />
          <Route path="transcribe" element={<Transcribe />} />
          <Route path="synthesize" element={<Text2Speech />} />
          <Route path="summarize" element={<Summarization />} />
          <Route path="translate" element={<Translation />} />
          <Route path="voxtrans" element={<VoiceLingo />} />
          <Route path="audio/:id" element={<ViewAudio />} />
          <Route path="voice/:id" element={<ViewVoxTrans />} />
          <Route path="tts/:id" element={<ViewttsAudio />} />
          <Route path="ttdata/:id" element={<ViewTranslations />} />
          <Route path="summarydata/:id" element={<ViewSummary />} />
          <Route path="video/:id" element={<ViewVideo />} />
          <Route path="voice" element={<Voice2Voice />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="contact-support" element={<ContactSupport />} />
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;

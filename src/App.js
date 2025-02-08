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
import ViewAIVoice from "./views/ViewAIVoice";
import ViewVoxTrans from "./views/ViewVoxTrans";
import Summarization from "./views/Summarization";
import ViewSummary from "./views/ViewSummary";
import ViewChat from "./views/ViewChat";
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

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate replace to="/dashboard" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/get-started" element={<PublicRoute><GetStarted /></PublicRoute>} />
          <Route path="/pricing" element={<PublicRoute><Pricing /></PublicRoute>} />
          <Route path="/documentation" element={<PublicRoute><APis /></PublicRoute>} />
          <Route path="/api-reference" element={<PublicRoute><APIReference /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Sidenav /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="agents" element={<LiveStream />} />
            <Route path="conversational-ai" element={<VideoStream />} />
            <Route path="history" element={<Transcribe />} />
            <Route path="synthesize" element={<Text2Speech />} />
            <Route path="summarize" element={<Summarization />} />
            <Route path="translate" element={<Translation />} />
            <Route path="voxtrans" element={<VoiceLingo />} />
            <Route path="audio/:id" element={<ViewAudio />} />
            <Route path="chats/:id" element={<ViewChat />} />
            <Route path="aivoice/:id" element={<ViewAIVoice />} />
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
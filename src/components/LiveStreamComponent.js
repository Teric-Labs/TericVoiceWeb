import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import microphone from "../assets/microphone.png";
import CustomPanel from "./CustomPanel";

const LiveStreamComponent = () => {
  const [websocket, setWebsocket] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const transcriptBoxRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/transcribe");
    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };
    ws.onmessage = (event) => {
      console.log("Received message:", event.data);
      // Append new transcription to the existing one
      setTranscription((prevTranscription) => prevTranscription + " " + event.data);
      // Scroll to the bottom of the transcriptBox
      transcriptBoxRef.current.scrollTop = transcriptBoxRef.current.scrollHeight;
    };
    ws.onerror = (error) => {
      console.error("WebSocket Error: ", error);
    };
    setWebsocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (websocket && websocket.readyState === WebSocket.OPEN) {
          console.log("Sending data");
          websocket.send(e.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Stop recording after 10 seconds and restart
      setInterval(() => {
        console.log("Restarting recording");
        mediaRecorder.stop();
        mediaRecorder.start();
      }, 10000);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadTranscription = () => {
    const blob = new Blob([transcription], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcription.txt";
    a.click();
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom sx={{ margin: 2 }}>
        Record and Transcribe in Realtime
      </Typography>
      <Box mb={3}>
        <CustomPanel heading="Record" value="" imageUrl={microphone} />
      </Box>
      <Box id="record" sx={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box>
          <Button onClick={startRecording} disabled={isRecording}>
            Start Recording
          </Button>
          <Button onClick={stopRecording} disabled={!isRecording}>
            Stop Recording
          </Button>
        </Box>
        <Paper
          elevation={3}
          style={{
            maxHeight: "300px",
            width: '80%',
            maxWidth: "100%",
            height: "100px",
            overflowY: "auto",
            padding: "10px",
            fontFamily: "monospace",
          }}
          ref={transcriptBoxRef}
        >
          <Typography variant="body2" align="left">
            {transcription}
          </Typography>
        </Paper>
        <Button onClick={downloadTranscription} sx={{ marginTop: 2 }}>
          Download Transcription
        </Button>
      </Box>
    </Box>
  );
};

export default LiveStreamComponent;

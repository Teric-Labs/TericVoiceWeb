import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Paper, Divider, Link, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import TranslateIcon from '@mui/icons-material/Translate';
import SummarizeIcon from '@mui/icons-material/Summarize';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import TextFieldsIcon from '@mui/icons-material/TextFields';

const StyledNavLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
  '&.active': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const CodeBlock = styled('pre')(({ theme }) => ({
  backgroundColor: 'black',
  color:'white',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  overflowX: 'auto',
  fontSize: '0.9rem',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
}));

const Section = ({ title, children, id }) => (
  <Paper elevation={3} sx={{ p: 4, mb: 4 }} id={id}>
    <Typography variant="h4" gutterBottom>{title}</Typography>
    {children}
  </Paper>
);

const CodeTabs = ({ codes }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={handleChange} aria-label="code examples">
        {Object.keys(codes).map((lang, index) => (
          <Tab label={lang} key={index} />
        ))}
      </Tabs>
      {Object.entries(codes).map(([lang, code], index) => (
        <TabPanel value={value} index={index} key={lang}>
          <CodeBlock>{code}</CodeBlock>
        </TabPanel>
      ))}
    </Box>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`code-tabpanel-${index}`}
      aria-labelledby={`code-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Documentation = () => {
  const menuItems = [
    { text: 'Voice', icon: <RecordVoiceOverIcon />, id: '#voice' },
    { text: 'Text', icon: <TextFieldsIcon />, id: '#text' },
    { text: 'Summarization', icon: <SummarizeIcon />, id: '#summarization' },
    { text: 'File Upload', icon: <UploadFileIcon />, id: '#file-upload' },
    { text: 'Get Audios', icon: <DownloadIcon />, id: '#get-audios' },
    { text: 'Translate Document', icon: <TranslateIcon />, id: '#translate-doc' },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: 'white', color: 'black', minHeight: '100vh', }}>
     <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            bgcolor: '#fff',
            color: 'white',
            mt: '64px',
          },
          
        }}
      >
        <List>
          {menuItems.map((item) => (
            <StyledNavLink href={item.id} key={item.text}>
              <ListItem button>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            </StyledNavLink>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 4, bgcolor: 'white', mt: '64px' }}>
          <Typography variant="h2" gutterBottom>API Documentation</Typography>
          <Typography variant="body1" paragraph>
            Welcome to the official documentation for our API. Below you will find detailed information on the various endpoints, their expected payloads, and code examples for different programming languages.
          </Typography>
          
          <Section title="Voice" id="voice">
            <Typography variant="h5" gutterBottom>Voice to Text</Typography>
            <Typography variant="body1" paragraph>
              Convert spoken words to text using our advanced speech recognition technology.
            </Typography>
            <Typography variant="h6">Endpoint</Typography>
            <Typography variant="body1" paragraph>
              <code>POST https://api.example.com/voice-to-text</code>
            </Typography>
            <Typography variant="h6">Code Examples</Typography>
            <CodeTabs codes={{
              Python: `
import requests

url = 'https://api.example.com/voice-to-text'
files = {'audio': open('recording.wav', 'rb')}
response = requests.post(url, files=files)
print(response.json())
              `,
              JavaScript: `
const formData = new FormData();
formData.append('audio', audioBlob, 'recording.wav');

fetch('https://api.example.com/voice-to-text', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
              `,
              cURL: `
curl -X POST https://api.example.com/voice-to-text \\
  -F "audio=@recording.wav"
              `,
              Go: `
package main

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
)

func main() {
	url := "https://api.example.com/voice-to-text"
	file, _ := os.Open("recording.wav")
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, _ := writer.CreateFormFile("audio", "recording.wav")
	io.Copy(part, file)
	writer.Close()

	r, _ := http.NewRequest("POST", url, body)
	r.Header.Add("Content-Type", writer.FormDataContentType())
	client := &http.Client{}
	resp, _ := client.Do(r)
	fmt.Println(resp.Status)
}
              `,
              PHP: `
<?php
$url = 'https://api.example.com/voice-to-text';
$file = new CURLFile('recording.wav', 'audio/wav', 'recording.wav');
$data = array('audio' => $file);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
              `,
              Java: `
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

public class VoiceToTextExample {
    public static void main(String[] args) throws IOException {
        String url = "https://api.example.com/voice-to-text";
        String boundary = "===" + System.currentTimeMillis() + "===";

        URL obj = new URL(url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
        con.setDoOutput(true);

        try (OutputStream os = con.getOutputStream()) {
            PrintWriter writer = new PrintWriter(new OutputStreamWriter(os, "UTF-8"), true);

            writer.println("--" + boundary);
            writer.println("Content-Disposition: form-data; name=\"audio\"; filename=\"recording.wav\"");
            writer.println("Content-Type: audio/wav");
            writer.println();
            writer.flush();

            FileInputStream fileInputStream = new FileInputStream("recording.wav");
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = fileInputStream.read(buffer)) != -1) {
                os.write(buffer, 0, bytesRead);
            }
            os.flush();
            fileInputStream.close();

            writer.println();
            writer.println("--" + boundary + "--");
            writer.flush();
        }

        int responseCode = con.getResponseCode();
        System.out.println("Response Code : " + responseCode);

        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();
        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        System.out.println(response.toString());
    }
}
              `
            }} />

            <Typography variant="h5" gutterBottom>Text to Voice</Typography>
            <Typography variant="body1" paragraph>
              Convert text to natural-sounding speech using our text-to-speech technology.
            </Typography>
            <Typography variant="h6">Endpoint</Typography>
            <Typography variant="body1" paragraph>
              <code>wss://api.example.com/realtime-voice-to-text</code>
            </Typography>
            <Typography variant="h6">Code Examples</Typography>
            <CodeTabs codes={{
              JavaScript: `
const socket = new WebSocket('wss://api.example.com/realtime-voice-to-text');

socket.onopen = function(e) {
  console.log("Connection established");
};

socket.onmessage = function(event) {
  console.log('Received text:', event.data);
};

// Assuming you have audio data in chunks
function sendAudioChunk(audioChunk) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(audioChunk);
  }
}
              `,
              Python: `
import asyncio
import websockets

async def realtime_voice_to_text():
    uri = "wss://api.example.com/realtime-voice-to-text"
    async with websockets.connect(uri) as websocket:
        while True:
            audio_chunk = get_audio_chunk()  # Implement this function to get audio data
            await websocket.send(audio_chunk)
            text = await websocket.recv()
            print(f"Received text: {text}")

asyncio.get_event_loop().run_until_complete(realtime_voice_to_text())
              `,
            }} />
          </Section>

          <Section title="Text" id="text">
            <Typography variant="h5" gutterBottom>Text Translation</Typography>
            <Typography variant="body1" paragraph>
              Translate text from one language to another using our advanced translation API.
            </Typography>
            <Typography variant="h6">Endpoint</Typography>
            <Typography variant="body1" paragraph>
              <code>POST https://api.example.com/translate</code>
            </Typography>
            <Typography variant="h6">Code Examples</Typography>
            <CodeTabs codes={{
              Python: `
import requests

url = 'https://api.example.com/translate'
data = {
    'text': 'Hello, world!',
    'source_lang': 'en',
    'target_lang': 'fr'
}
response = requests.post(url, json=data)
print(response.json())
              `,
              JavaScript: `
fetch('https://api.example.com/translate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'Hello, world!',
    source_lang: 'en',
    target_lang: 'fr'
  }),
})
.then(response => response.json())
.then(data => console.log(data));
              `,
              cURL: `
curl -X POST https://api.example.com/translate \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Hello, world!","source_lang":"en","target_lang":"fr"}'
              `,
            }} />

            <Typography variant="h5" gutterBottom>Document Translation</Typography>
            <Typography variant="body1" paragraph>
              Translate entire documents while preserving formatting.
            </Typography>
            <Typography variant="h6">Endpoint</Typography>
            <Typography variant="body1" paragraph>
              <code>POST https://api.example.com/translate-document</code>
            </Typography>
            <Typography variant="h6">Code Examples</Typography>
            <CodeTabs codes={{
              Python: `
import requests

url = 'https://api.example.com/translate-document'
files = {'document': open('document.docx', 'rb')}
data = {'source_lang': 'en', 'target_lang': 'fr'}
response = requests.post(url, files=files, data=data)
with open('translated_document.docx', 'wb') as f:
    f.write(response.content)
              `,
              JavaScript: `
const formData = new FormData();
formData.append('document', documentFile);
formData.append('source_lang', 'en');
formData.append('target_lang', 'fr');

fetch('https://api.example.com/translate-document', {
  method: 'POST',
  body: formData
})
.then(response => response.blob())
.then(blob => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'translated_document.docx';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
});
              `,
              cURL: `
curl -X POST https://api.example.com/translate-document \\
  -F "document=@document.docx" \\
  -F "source_lang=en" \\
  -F "target_lang=fr" \\
  --output translated_document.docx
              `,
            }} />
          </Section>

          <Section title="Summarization" id="summarization">
            <Typography variant="h5" gutterBottom>Text Summarization</Typography>
            <Typography variant="body1" paragraph>
              Generate concise summaries of text content.
            </Typography>
            <Typography variant="h6">Endpoint</Typography>
            <Typography variant="body1" paragraph>
              <code>POST https://api.example.com/summarize-text</code>
            </Typography>
            <Typography variant="h6">Code Examples</Typography>
            <CodeTabs codes={{
              Python: `
import requests

url = 'https://api.example.com/summarize-text'
data = {
    'text': 'Your long text here...',
    'max_length': 100
}
response = requests.post(url, json=data)
print(response.json())
              `,
              JavaScript: `
fetch('https://api.example.com/summarize-text', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'Your long text here...',
    max_length: 100
  }),
})
.then(response => response.json())
.then(data => console.log(data));
              `,
              cURL: `
curl -X POST https://api.example.com/summarize-text \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Your long text here...","max_length":100}'
              `,
            }} />

            <Typography variant="h5" gutterBottom>Document Summarization</Typography>
            <Typography variant="body1" paragraph>
              Generate summaries of entire documents.
            </Typography>
            <Typography variant="h6">Endpoint</Typography>
            <Typography variant="body1" paragraph>
              <code>POST https://api.example.com/summarize-document</code>
            </Typography>
            <Typography variant="h6">Code Examples</Typography>
            <CodeTabs codes={{
              Python: `
import requests

url = 'https://api.example.com/summarize-document'
files = {'document': open('document.pdf', 'rb')}
data = {'max_length': 500}
response = requests.post(url, files=files, data=data)
print(response.json())
              `,
              JavaScript: `
const formData = new FormData();
formData.append('document', documentFile);
formData.append('max_length', 500);

fetch('https://api.example.com/summarize-document', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
              `,
              cURL: `
curl -X POST https://api.example.com/summarize-document \\
  -F "document=@document.pdf" \\
  -F "max_length=500"
              `,
            }} />
          </Section>

          {/* Existing sections (File Upload, Get Audios, Translate Document) can be kept as they are */}
          
        
      </Box>
    </Box>
  );
};

export default Documentation;
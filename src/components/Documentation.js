import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Box,
  IconButton,
  Tooltip,
  Drawer,
  ListItem,
  ListItemText,
  ListSubheader,
  Divider,
  Chip,
  useTheme,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Fab,
  Alert,
  Card,
  CardContent,
  Stack,
  alpha
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import HttpIcon from '@mui/icons-material/Http';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Categorized endpoints with updated structure
const categorizedEndpoints = {
  'Text Translation': [
  {
    method: "POST",
    path: "/translate",
    description: "Translate text content with multilingual support.",
    parameters: {
      type: "multipart/form-data",
      fields: {
        user_id: {
          type: "string",
          required: true,
          description: "Unique identifier for the user"
        },
        source_lang: {
          type: "string",
          required: true,
          description: "Source language code of the text"
        },
        target_langs: {
          type: "array",
          required: true,
          description: "Array of target language codes for translation"
        },
        doc: {
          type: "string",
          required: true,
          description: "Text content to be translated"
        },
        title: {
          type: "string",
          required: true,
          description: "Title for the translation"
        }
      }
    }
  },
  {
    method: "POST",
    path: "/translate_document",
    description: "Translate document files with multilingual support.",
    parameters: {
      type: "multipart/form-data",
      fields: {
        user_id: {
          type: "string",
          required: true,
          description: "Unique identifier for the user"
        },
        source_lang: {
          type: "string",
          required: true,
          description: "Source language code of the document"
        },
        target_langs: {
          type: "array",
          required: true,
          description: "Array of target language codes for translation"
        },
        title: {
          type: "string",
          required: true,
          description: "Title for the document translation"
        },
        file: {
          type: "file",
          required: true,
          description: "Document file to be translated"
        }
      }
    }
  },
  {
    method: "POST",
    path: "/get_document",
    description: "Retrieve a specific translated document.",
    parameters: {
      type: "application/json",
      fields: {
        doc_id: {
          type: "string",
          required: true,
          description: "Document identifier for the translation"
        }
      }
    }
  },
  {
    method: "POST",
    path: "/get_doucument_translations",
    description: "Retrieve all document translations for a user.",
    parameters: {
      type: "application/json",
      fields: {
        user_id: {
          type: "string",
          required: true,
          description: "Unique identifier for the user to fetch their translations"
        }
      }
    }
  },
  {
    method: "POST",
    path: "/get_translation",
    description: "Retrieve a specific translation.",
    parameters: {
      type: "application/json",
      fields: {
        doc_id: {
          type: "string",
          required: true,
          description: "Document identifier for the translation"
        }
      }
    }
  }
],
  'Voice to Text': [
  {
    method: "POST",
    path: "/upload",
    description: "Upload and transcribe audio file to text with multilingual support.",
    parameters: {
      type: "multipart/form-data",
      fields: {
        audio_file: {
          type: "file",
          required: true,
          description: "Audio file to be transcribed"
        },
        source_lang: {
          type: "string",
          required: true,
          description: "Source language code of the audio"
        },
        target_langs: {
          type: "array",
          required: true,
          description: "Array of target language codes for transcription"
        },
        user_id: {
          type: "string",
          required: true,
          description: "Unique identifier for the user"
        },
        title: {
          type: "string",
          required: true,
          description: "Title for the transcription"
        }
      }
    }
  },
  {
    method: "POST",
    path: "/upload_recorded_audio",
    description: "Upload and transcribe recorded audio to text with multilingual support.",
    parameters: {
      type: "multipart/form-data",
      fields: {
        recorded_audio: {
          type: "file",
          required: true,
          description: "Recorded audio file to be transcribed"
        },
        source_lang: {
          type: "string",
          required: true,
          description: "Source language code of the recorded audio"
        },
        target_langs: {
          type: "array",
          required: true,
          description: "Array of target language codes for transcription"
        },
        user_id: {
          type: "string",
          required: true,
          description: "Unique identifier for the user"
        },
        title: {
          type: "string",
          required: true,
          description: "Title for the transcription"
        }
      }
    }
  },
  {
    method: "POST",
    path: "/save_audio",
    description: "Save audio file with existing transcription text.",
    parameters: {
      type: "multipart/form-data",
      fields: {
        audio_file: {
          type: "file",
          required: true,
          description: "Audio file to be saved"
        },
        source_lang: {
          type: "string",
          required: true,
          description: "Source language code"
        },
        target_langs: {
          type: "array",
          required: true,
          description: "Array of target language codes"
        },
        user_id: {
          type: "string",
          required: true,
          description: "Unique identifier for the user"
        },
        source_text: {
          type: "string",
          required: true,
          description: "Existing transcription text for the audio"
        }
      }
    }
  },
  {
    method: "POST",
    path: "/get_audios",
    description: "Retrieve all transcribed audios for a user.",
    parameters: {
      type: "application/json",
      fields: {
        user_id: {
          type: "string",
          required: true,
          description: "Unique identifier for the user to fetch their transcriptions"
        }
      }
    }
  },
  {
    method: "POST",
    path: "/get_audio",
    description: "Retrieve a specific transcribed audio.",
    parameters: {
      type: "application/json",
      fields: {
        doc_id: {
          type: "string",
          required: true,
          description: "Document identifier for the transcription"
        }
      }
    }
  }
],
  'Video Transcription': [
  {
    method: "POST",
    path: "/videoUpload",
    description: "Upload and transcribe video content with multilingual support.",
    parameters: {
      type: "multipart/form-data",
      fields: {
        youtube_link: {
          type: "file",
          required: true,
          description: "Video file to be transcribed"
        },
        user_id: {
          type: "string",
          required: true,
          description: "Unique identifier for the user"
        },
        source_lang: {
          type: "string",
          required: true,
          description: "Source language code"
        },
        target_langs: {
          type: "array",
          required: true,
          description: "Array of target language codes for transcription"
        },
        title: {
          type: "string",
          required: true,
          description: "Title for the video transcription"
        }
      }
    }
  },
  {
    method: "POST",
    path: "/extract_audio_from_video",
    description: "Extract audio from video for transcription processing.",
    parameters: {
      type: "multipart/form-data",
      fields: {
        user_id: {
          type: "string",
          required: true,
          description: "Unique identifier for the user"
        },
        source_lang: {
          type: "string",
          required: true,
          description: "Source language code"
        },
        target_langs: {
          type: "array",
          required: true,
          description: "Array of target language codes"
        },
        video_type: {
          type: "string",
          required: true,
          description: "Type of video source (e.g., upload, youtube)"
        },
        video_link: {
          type: "string",
          required: true,
          description: "URL or path to the video"
        },
        title: {
          type: "string",
          required: true,
          description: "Title for the extracted audio"
        }
      }
    }
  },
  {
    method: "POST",
    path: "/get_video",
    description: "Retrieve transcribed video data.",
    parameters: {
      type: "application/json",
      fields: {
        user_id: {
          type: "string",
          required: true,
          description: "Unique identifier for the user to fetch their video transcriptions"
        }
      }
    }
  },
  {
    method: "POST",
    path: "/get_audio_data",
    description: "Retrieve extracted audio data from video.",
    parameters: {
      type: "application/json",
      fields: {
        doc_id: {
          type: "string",
          required: true,
          description: "Document identifier for the audio data"
        }
      }
    }
  }
],
  'Summarization': [
  {
    method: "POST",
    path: "/surmarize",
    description: "Summarize text content with language support.",
    parameters: {
      type: "multipart/form-data",
      fields: {
        user_id: {
          type: "string",
          required: true,
          description: "Unique identifier for the user"
        },
        source_lang: {
          type: "string",
          required: true,
          description: "Source language code"
        },
        doc: {
          type: "string",
          required: true,
          description: "Text content to be summarized"
        },
        title: {
          type: "string",
          required: true,
          description: "Title for the summarization"
        }
      }
    }
  },
  {
    method: "POST",
    path: "/surmarize_audio_from_video",
    description: "Extract and summarize audio content from a video.",
    parameters: {
      type: "multipart/form-data",
      fields: {
        user_id: {
          type: "string",
          required: true,
          description: "Unique identifier for the user"
        },
        source_lang: {
          type: "string",
          required: true,
          description: "Source language code"
        },
        video_type: {
          type: "string",
          required: true,
          description: "Type of video source"
        },
        video_link: {
          type: "string",
          required: true,
          description: "URL or link to the video"
        },
        title: {
          type: "string",
          required: true,
          description: "Title for the summarization"
        }
      }
    }
  },
  {
    method: "POST",
    path: "/summarize_document",
    description: "Summarize content from an uploaded document.",
    parameters: {
      type: "multipart/form-data",
      fields: {
        user_id: {
          type: "string",
          required: true,
          description: "Unique identifier for the user"
        },
        source_lang: {
          type: "string",
          required: true,
          description: "Source language code"
        },
        title: {
          type: "string",
          required: true,
          description: "Title for the summarization"
        },
        file: {
          type: "file",
          required: true,
          description: "Document file to be summarized"
        }
      }
    }
  },
  {
    method: "POST",
    path: "/summarize_upload",
    description: "Summarize content from an uploaded audio file.",
    parameters: {
      type: "multipart/form-data",
      fields: {
        user_id: {
          type: "string",
          required: true,
          description: "Unique identifier for the user"
        },
        source_lang: {
          type: "string",
          required: true,
          description: "Source language code"
        },
        title: {
          type: "string",
          required: true,
          description: "Title for the summarization"
        },
        audio_file: {
          type: "file",
          required: true,
          description: "Audio file to be summarized"
        }
      }
    }
  },
  {
    method: "POST",
    path: "/get_summaries",
    description: "Retrieve all summaries for a user.",
    parameters: {
      type: "application/json",
      fields: {
        user_id: {
          type: "string",
          required: true,
          description: "Unique identifier for the user"
        }
      }
    }
  },
  {
    method: "POST",
    path: "/get_summary",
    description: "Retrieve a specific summary.",
    parameters: {
      type: "application/json",
      fields: {
        doc_id: {
          type: "string",
          required: true,
          description: "Document identifier for the summary"
        }
      }
    }
  }
],
  'Text to Speech': [
    {
      method: "POST",
      path: "/vocify",
      description: "Convert text to speech with multilingual support.",
      parameters: {
        type: "multipart/form-data",
        fields: {
          user_id: {
            type: "string",
            required: true,
            description: "Unique identifier for the user"
          },
          source_lang: {
            type: "string",
            required: true,
            description: "Source language code"
          },
          target_langs: {
            type: "array",
            required: true,
            description: "Array of target language codes"
          },
          title: {
            type: "string",
            required: true,
            description: "Title for the TTS conversion"
          },
          doc: {
            type: "string",
            required: true,
            description: "Text content to be converted to speech"
          }
        }
      }
    },
    {
      method: "POST",
      path: "/translate_document_with_tts",
      description: "Convert document content to speech with multilingual support.",
      parameters: {
        type: "multipart/form-data",
        fields: {
          user_id: {
            type: "string",
            required: true,
            description: "Unique identifier for the user"
          },
          source_lang: {
            type: "string",
            required: true,
            description: "Source language code"
          },
          target_langs: {
            type: "array",
            required: true,
            description: "Array of target language codes"
          },
          title: {
            type: "string",
            required: true,
            description: "Title for the document TTS conversion"
          },
          file: {
            type: "file",
            required: true,
            description: "Document file to be converted to speech"
          }
        }
      }
    },
    {
      method: "POST",
      path: "/get_vocify_voices",
      description: "Retrieve all TTS conversions for a user.",
      parameters: {
        type: "application/json",
        fields: {
          user_id: {
            type: "string",
            required: true,
            description: "Unique identifier for the user"
          }
        }
      }
    },
    {
      method: "POST",
      path: "/get_vocify_voice",
      description: "Retrieve a specific TTS conversion.",
      parameters: {
        type: "application/json",
        fields: {
          doc_id: {
            type: "string",
            required: true,
            description: "Document identifier for the TTS conversion"
          }
        }
      }
    },
    {
      method: "POST",
      path: "/get_document_voices",
      description: "Retrieve all document TTS conversions for a user.",
      parameters: {
        type: "application/json",
        fields: {
          user_id: {
            type: "string",
            required: true,
            description: "Unique identifier for the user"
          }
        }
      }
    },
    {
      method: "POST",
      path: "/get_document_voice",
      description: "Retrieve a specific document TTS conversion.",
      parameters: {
        type: "application/json",
        fields: {
          doc_id: {
            type: "string",
            required: true,
            description: "Document identifier for the TTS conversion"
          }
        }
      }
    }
  ],
  'Voice to Voice Translation': [
    { 
      method: "POST", 
      path: "/voicox", 
      description: "Translate voice recording to multiple languages.", 
      parameters: {
        type: "multipart/form-data",
        fields: {
          audio_file: {
            type: "file",
            required: true,
            description: "Audio file to be translated"
          },
          user_id: {
            type: "string",
            required: true,
            description: "Unique identifier for the user"
          },
          source_lang: {
            type: "string",
            required: true,
            description: "Source language code"
          },
          target_langs: {
            type: "array",
            required: true,
            description: "Array of target language codes"
          },
          title: {
            type: "string",
            required: true,
            description: "Title for the translation"
          }
        }
      }
    },
    {
      method: "POST",
      path: "/recorded_audio_vv",
      description: "Upload and translate recorded audio to multiple languages.",
      parameters: {
        type: "multipart/form-data",
        fields: {
          recorded_audio: {
            type: "file",
            required: true,
            description: "Recorded audio file"
          },
          source_lang: {
            type: "string",
            required: true,
            description: "Source language code"
          },
          target_langs: {
            type: "array",
            required: true,
            description: "Array of target language codes"
          },
          user_id: {
            type: "string",
            required: true,
            description: "Unique identifier for the user"
          },
          title: {
            type: "string",
            required: true,
            description: "Title for the recording"
          }
        }
      }
    },
    {
      method: "POST",
      path: "/get_voices",
      description: "Retrieve all voice translations for a user.",
      parameters: {
        user_id: "string"
      }
    },
    {
      method: "POST",
      path: "/get_ttsvoice",
      description: "Retrieve a specific voice translation.",
      parameters: {
        doc_id: "string"
      }
    }
  ],
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f7',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: 320,
          padding: '24px',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          '&:before': {
            display: 'none',
          },
          boxShadow: 'none',
          border: '1px solid',
          borderColor: 'divider',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
        },
      },
    },
  },
});

const ParameterCard = ({ name, details, theme }) => (
  <Card 
    variant="outlined" 
    sx={{ 
      mb: 2,
      position: 'relative',
      '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.02),
      },
      transition: 'all 0.2s ease-in-out',
    }}
  >
    <CardContent>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Typography variant="subtitle1" fontWeight="bold">
          {name}
        </Typography>
        <Chip
          label={details.required ? 'Required' : 'Optional'}
          color={details.required ? 'primary' : 'default'}
          size="small"
          sx={{ 
            fontWeight: 500,
            backgroundColor: details.required ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.grey[500], 0.1),
          }}
        />
        <Chip
          label={details.type}
          variant="outlined"
          size="small"
          sx={{ 
            borderColor: theme.palette.grey[300],
            color: theme.palette.text.secondary,
          }}
        />
      </Stack>
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{
          lineHeight: 1.6,
          maxWidth: '90%',
        }}
      >
        {details.description}
      </Typography>
    </CardContent>
  </Card>
);

const EndpointHeader = ({ endpoint, theme }) => (
  <Box sx={{ mb: 3 }}>
    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
      <Chip
        icon={<HttpIcon />}
        label={endpoint.method}
        color="primary"
        sx={{
          px: 2,
          height: 32,
          fontWeight: 600,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
        }}
      />
      <Typography variant="h6" component="span" sx={{ fontFamily: 'monospace', color: theme.palette.text.primary }}>
        {endpoint.path}
      </Typography>
    </Stack>
    <Alert 
      severity="info" 
      icon={<InfoIcon />}
      sx={{
        backgroundColor: alpha(theme.palette.info.main, 0.05),
        border: '1px solid',
        borderColor: alpha(theme.palette.info.main, 0.1),
        '& .MuiAlert-message': {
          color: theme.palette.text.primary,
        },
      }}
    >
      {endpoint.description}
    </Alert>
  </Box>
);
const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`code-tabpanel-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{
          margin: 0,
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        {code}
      </SyntaxHighlighter>
      <Tooltip title={copied ? "Copied!" : "Copy to clipboard"} placement="top">
        <IconButton
          onClick={handleCopy}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const ParametersSection = ({ parameters }) => {
  const theme = useTheme();
  
  if (parameters.type === 'multipart/form-data') {
    return (
      <Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Content-Type: {parameters.type}
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(parameters.fields).map(([name, details]) => (
            <Grid item xs={12} key={name}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  backgroundColor: theme.palette.grey[50],
                  borderRadius: 1
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mr: 1 }}>
                    {name}
                  </Typography>
                  <Chip
                    label={details.required ? 'Required' : 'Optional'}
                    size="small"
                    color={details.required ? 'primary' : 'default'}
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={details.type}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {details.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <pre style={{ margin: 0, overflow: 'auto' }}>
        {JSON.stringify(parameters, null, 2)}
      </pre>
    </Paper>
  );
};

const generateCodeSnippets = (endpoint) => {
  const apiUrl = `https://avoices-13747549899.us-central1.run.app${endpoint.path}`;
  const isMultipart = endpoint.parameters?.type === 'multipart/form-data';

  if (isMultipart) {
    const fields = endpoint.parameters.fields;
    
    return {
      curl: `curl -X POST "${apiUrl}" \\
${Object.entries(fields).map(([key, value]) => {
  if (value.type === 'file') {
    return `  -F "${key}=@file.${key === 'audio_file' ? 'mp3' : 'wav'}" \\`;
  }
  return `  -F "${key}=${value.type === 'array' ? '["en","es"]' : 'example_value'}" \\`;
}).join('\n')}`,

      python: `import requests

def ${endpoint.path.replace(/\//g, '_').slice(1)}(${Object.keys(fields).join(', ')}):
    url = "${apiUrl}"
    files = {
        ${Object.entries(fields).map(([key, value]) => {
          if (value.type === 'file') {
            return `'${key}': open(${key}, 'rb')`;
          }
          return `'${key}': ('', ${key})`;
        }).join(',\n        ')}
    }
    
    response = requests.post(url, files=files)
    return response.json()`,

      javascript: `async function ${endpoint.path.replace(/\//g, '_').slice(1)}(${Object.keys(fields).join(', ')}) {
  const url = "${apiUrl}";
  const formData = new FormData();
  
  ${Object.entries(fields).map(([key, value]) => {
    if (value.type === 'array') {
      return `formData.append('${key}', JSON.stringify(${key}));`;
    }
    return `formData.append('${key}', ${key});`;
  }).join('\n  ')}

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}`
    };
  }

  // Regular JSON request handling
  return {
    curl: `curl -X POST "${apiUrl}" \\
     -H "Content-Type: application/json" \\
     -d '${JSON.stringify(endpoint.parameters, null, 2)}'`,

    python: `import requests

def ${endpoint.path.replace(/\//g, '_').slice(1)}(${Object.keys(endpoint.parameters).join(', ')}):
    url = "${apiUrl}"
    payload = ${JSON.stringify(endpoint.parameters, null, 2)}
    
    response = requests.post(url, json=payload)
    return response.json()`,

    javascript: `async function ${endpoint.path.replace(/\//g, '_').slice(1)}(${Object.keys(endpoint.parameters).join(', ')}) {
  const url = "${apiUrl}";
  const payload = ${JSON.stringify(endpoint.parameters, null, 2)};

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}`
  };
};

const Documentation = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeEndpoint, setActiveEndpoint] = useState('');
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const scrollToEndpoint = (endpointPath) => {
    const element = document.getElementById(endpointPath.replace(/\//g, '_'));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveEndpoint(endpointPath);
    if (!isDesktop) {
      setDrawerOpen(false);
    }
  };

  const languages = ['curl', 'python', 'javascript'];

  const NavigationContent = () => (
    <Box sx={{ height: '100%', overflowY: 'auto' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        API Services
      </Typography>
      <List sx={{ py: 0 }}>
        {Object.entries(categorizedEndpoints).map(([category, endpoints]) => (
          <React.Fragment key={category}>
            <ListSubheader
              sx={{
                bgcolor: 'background.paper',
                fontWeight: 'bold',
                color: theme.palette.text.primary,
              }}
            >
              {category}
            </ListSubheader>
            {endpoints.map((endpoint) => (
              <ListItem
                key={endpoint.path}
                button
                selected={activeEndpoint === endpoint.path}
                onClick={() => scrollToEndpoint(endpoint.path)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                  },
                }}
              >
                <ListItemText
                  primary={endpoint.path}
                  secondary={endpoint.description}
                  primaryTypographyProps={{
                    variant: 'body2',
                    sx: { fontWeight: 'medium' },
                  }}
                  secondaryTypographyProps={{
                    variant: 'caption',
                    sx: { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
                  }}
                />
              </ListItem>
            ))}
            <Divider sx={{ my: 2 }} />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, position: 'relative' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={9}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                    <Box sx={{mb:5, p:4}}>
                    <Box  sx={{mb:4}}>
                      <Typography variant="h4" className="font-bold mb-4" >
                        Avoices API Documentation
                      </Typography>
                      <Typography className="text-gray-600 mb-6 text-lg">
                        Welcome to our comprehensive API suite for multilingual content processing. This documentation provides detailed information about our REST APIs that enable powerful translation, transcription, and content transformation capabilities.
                      </Typography>
                      
                      <Stack className="space-y-4 mb-6">
                        <Typography variant="h6" className="font-semibold">
                          Core Features
                        </Typography>
                        <Box className="flex flex-wrap gap-2">
                          <Chip className="bg-blue-100 text-blue-800" label="Text Translation" />
                          <Chip className="bg-blue-100 text-blue-800" label="Voice to Text" />
                          <Chip className="bg-blue-100 text-blue-800" label="Video Transcription" />
                          <Chip className="bg-blue-100 text-blue-800" label="Text Summarization" />
                          <Chip className="bg-blue-100 text-blue-800" label="Text to Speech" />
                          <Chip className="bg-blue-100 text-blue-800" label="Voice Translation" />
                        </Box>
                      </Stack>
              
                      <Box className="space-y-4">
                        <Typography variant="h6" className="font-semibold">
                          Getting Started
                        </Typography>
                        <Typography className="text-gray-600">
                          Our APIs use REST architecture and support both JSON and multipart/form-data requests. All endpoints require authentication via user_id and accept multiple language specifications using standard language codes.
                        </Typography>
                      </Box>
              
                      <Box className="mt-6">
                        <Alert className="bg-blue-50 border-blue-100">
                          <InfoIcon className="h-5 w-5" />
                          <Box>
                            <Typography className="font-medium">Base URL</Typography>
                            <code className="bg-blue-100 px-2 py-1 rounded text-sm">
                            https://avoices-13747549899.us-central1.run.app
                            </code>
                          </Box>
                        </Alert>
                      </Box>
                    </Box>
                  </Box>
                
                {Object.entries(categorizedEndpoints).map(([category, endpoints]) => (
                  <Box key={category} sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                      {category}
                    </Typography>
                    <List sx={{ py: 0 }}>
                      {endpoints.map((endpoint, index) => (
                        <Accordion
                          key={index}
                          id={endpoint.path.replace(/\//g, '_')}
                          sx={{ mb: 2, borderRadius: '8px !important' }}
                        >
                          <AccordionSummary 
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                              backgroundColor: theme.palette.grey[50],
                              borderRadius: '8px',
                              '&:hover': {
                                backgroundColor: theme.palette.grey[100],
                              },
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                              <Chip 
                                label={endpoint.method}
                                color="primary"
                                size="small"
                                sx={{ mr: 2, fontWeight: 'bold' }}
                              />
                              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                {endpoint.path}
                              </Typography>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant="body1" paragraph>
                              {endpoint.description}
                            </Typography>
                            
                            <Typography variant="h6" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
                              Parameters
                            </Typography>
                            <ParametersSection parameters={endpoint.parameters} />

                            <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'bold' }}>
                              Code Examples
                            </Typography>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                              <Tabs 
                                value={selectedTab}
                                onChange={handleTabChange}
                                variant="scrollable"
                                scrollButtons="auto"
                              >
                                {languages.map((lang, i) => (
                                  <Tab 
                                    key={i}
                                    label={lang.toUpperCase()}
                                    sx={{ textTransform: 'uppercase', fontWeight: 'medium' }}
                                  />
                                ))}
                              </Tabs>
                            </Box>
                            
                            {languages.map((lang, i) => (
                              <TabPanel key={i} value={selectedTab} index={i}>
                                <CodeBlock
                                  code={generateCodeSnippets(endpoint)[lang]}
                                  language={lang}
                                />
                              </TabPanel>
                            ))}
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </List>
                  </Box>
                ))}
              </Paper>
            </Grid>

            {/* Desktop Navigation */}
            {isDesktop && (
              <Grid item lg={3}>
                <Paper
                  elevation={0}
                  sx={{
                    position: 'sticky',
                    top: 16,
                    p: 2,
                    borderRadius: 2,
                    maxHeight: 'calc(100vh - 32px)',
                    overflowY: 'auto',
                  }}
                >
                  <NavigationContent />
                </Paper>
              </Grid>
            )}
          </Grid>

          {/* Mobile Navigation */}
          {!isDesktop && (
            <>
              <Fab
                color="primary"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
                sx={{
                  position: 'fixed',
                  bottom: 16,
                  right: 16,
                }}
              >
                <MenuIcon />
              </Fab>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <NavigationContent />
              </Drawer>
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Documentation;
import React, { useEffect, useState } from "react";
import { Typography, Button, Snackbar, Alert } from "@mui/material";
import GetAppIcon from '@mui/icons-material/GetApp';
import TranslateIcon from '@mui/icons-material/Translate';
import { dataAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  ResultViewLayout, ResultSection, ResultLangAccordion, rvPrimaryButtonSx,
} from './result-view';

const ViewTranslationsComponent = ({ translationId }) => {
  const [entries, setEntries] = useState([]);
  const [scriptDate, setScriptDate] = useState("");
  const [scriptTitle, setScriptTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [copyToast, setCopyToast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await dataAPI.getTranslation(translationId);
        setEntries(response.entries);
        if (response.entries.length > 0) {
          setScriptDate(response.entries[0].Date);
          setScriptTitle(response.entries[0].title);
        }
      } catch { /* empty */ }
      finally { setLoading(false); }
    };
    fetchEntries();
  }, [translationId]);

  const downloadAsText = () => {
    let content = `Title: ${scriptTitle}\nDate: ${scriptDate}\n\n`;
    if (entries.length > 0) {
      content += `Original (${entries[0].sourceLanguage}):\n${entries[0].Original_transcript}\n\n`;
      Object.entries(entries[0].Translations || {}).forEach(([lang, t]) => {
        content += `${lang.toUpperCase()}:\n${t}\n\n`;
      });
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scriptTitle || 'translation'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => setCopyToast(true));
  };

  const entry = entries[0];
  const translations = entry?.Translations || {};

  return (
    <>
      <ResultViewLayout
        type="translation"
        title={scriptTitle || 'Translation'}
        date={scriptDate}
        onBack={() => navigate(-1)}
        loading={loading}
        empty={!loading && entries.length === 0}
        emptyMessage="No translation data available"
        emptyIcon={TranslateIcon}
        headerActions={
          entries.length > 0 ? (
            <Button startIcon={<GetAppIcon />} onClick={downloadAsText} sx={rvPrimaryButtonSx}>
              Download all
            </Button>
          ) : null
        }
      >
        {entry && (
          <>
            <ResultSection
              title={`Original (${(entry.sourceLanguage || '—').toUpperCase()})`}
              icon={TranslateIcon}
              onCopy={() => copyToClipboard(entry.Original_transcript)}
            >
              <Typography sx={{ color: 'rgba(17, 17, 17, 0.72)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>
                {entry.Original_transcript}
              </Typography>
            </ResultSection>

            {Object.entries(translations).map(([lang, translation], i) => (
              <ResultLangAccordion
                key={lang}
                langCode={lang}
                langLabel={lang.toUpperCase()}
                defaultExpanded={i === 0}
                onCopy={() => copyToClipboard(translation)}
              >
                <Typography sx={{ color: 'rgba(17, 17, 17, 0.72)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>
                  {translation}
                </Typography>
              </ResultLangAccordion>
            ))}
          </>
        )}
      </ResultViewLayout>

      <Snackbar open={copyToast} autoHideDuration={2000} onClose={() => setCopyToast(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setCopyToast(false)} sx={{ borderRadius: '12px' }}>Copied to clipboard</Alert>
      </Snackbar>
    </>
  );
};

export default ViewTranslationsComponent;

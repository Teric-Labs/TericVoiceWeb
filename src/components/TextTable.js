import React from 'react';
import { Stack, Typography, Chip } from '@mui/material';
import { VolumeUp } from '@mui/icons-material';
import ResultsTable from './ResultsTable';
import { dataAPI } from '../services/api';

const truncate = (t, n = 80) => t ? (t.length > n ? t.slice(0, n) + '…' : t) : '—';

const columns = [
  {
    id: 'source_lang', label: 'Language', sortable: false,
    render: row => <Chip label={row.source_lang || '—'} size="small" variant="outlined" />,
  },
  {
    id: 'original_text', label: 'Text', sortable: false,
    render: row => <Typography variant="body2" color="text.secondary">{truncate(row.original_text)}</Typography>,
  },
  {
    id: 'date', label: 'Date',
    render: row => row.date ? new Date(row.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—',
  },
];

export default function TextTable() {
  return (
    <ResultsTable
      fetchFn={id => dataAPI.getVocifyVoices(id)}
      columns={columns}
      viewPath={id => `/dashboard/tts/${id}`}
      searchFilter={(r, q) =>
        (r.title || '').toLowerCase().includes(q.toLowerCase()) ||
        (r.original_text || '').toLowerCase().includes(q.toLowerCase())
      }
      searchPlaceholder="Search speech files…"
      emptyTitle="No text-to-speech files yet"
      emptySubtitle="Generate speech from text and your files will appear here."
    />
  );
}

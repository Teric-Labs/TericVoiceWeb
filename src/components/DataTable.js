import React from 'react';
import { Stack, Typography, Chip } from '@mui/material';
import { AudioFile } from '@mui/icons-material';
import ResultsTable from './ResultsTable';
import { dataAPI } from '../services/api';

const columns = [
  {
    id: 'status', label: 'Status', sortable: false,
    render: row => (
      <Chip label={row.status || 'completed'} size="small"
        color={row.status === 'processing' ? 'warning' : 'success'} />
    ),
  },
  {
    id: 'Date', label: 'Date',
    render: row => row.Date ? new Date(row.Date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—',
  },
];

export default function DataTable() {
  return (
    <ResultsTable
      fetchFn={id => dataAPI.getAudios(id)}
      columns={columns}
      viewPath={id => `/dashboard/audio/${id}`}
      collectionName="audio_store"
      searchPlaceholder="Search transcripts…"
      emptyTitle="No transcriptions yet"
      emptySubtitle="Upload or record audio to get your first transcription."
      dateKey="Date"
    />
  );
}

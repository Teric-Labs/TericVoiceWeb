import React from 'react';
import { Stack, Typography, Chip } from '@mui/material';
import { VideoFile } from '@mui/icons-material';
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
    id: 'date', label: 'Date',
    render: row => row.date ? new Date(row.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—',
  },
];

export default function VideoTable() {
  return (
    <ResultsTable
      fetchFn={id => dataAPI.getVideos(id)}
      columns={columns}
      viewPath={id => `/dashboard/video/${id}`}
      searchPlaceholder="Search videos…"
      emptyTitle="No videos processed yet"
      emptySubtitle="Submit a YouTube link or video file to get started."
    />
  );
}

import React from 'react';
import { Stack, Typography, Chip } from '@mui/material';
import { Summarize } from '@mui/icons-material';
import ResultsTable from './ResultsTable';
import { dataAPI } from '../services/api';

const truncate = (t, n = 100) => t ? (t.length > n ? t.slice(0, n) + '…' : t) : '—';

const columns = [
  {
    id: 'type', label: 'Type', sortable: false,
    render: row => <Chip label={row.type || 'text'} size="small" variant="outlined" />,
  },
  {
    id: 'summary', label: 'Preview', sortable: false,
    render: row => <Typography variant="body2" color="text.secondary">{truncate(row.summary || row.text)}</Typography>,
  },
  {
    id: 'date', label: 'Date',
    render: row => row.date ? new Date(row.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—',
  },
];

export default function SummaryTable() {
  return (
    <ResultsTable
      fetchFn={id => dataAPI.getSummaries(id)}
      columns={columns}
      viewPath={id => `/dashboard/summarydata/${id}`}
      collectionName="summary"
      searchFilter={(r, q) =>
        (r.title || '').toLowerCase().includes(q.toLowerCase()) ||
        (r.summary || r.text || '').toLowerCase().includes(q.toLowerCase())
      }
      searchPlaceholder="Search summaries…"
      emptyTitle="No summaries yet"
      emptySubtitle="Summarize text, audio, or documents and they'll appear here."
    />
  );
}

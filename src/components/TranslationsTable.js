import React from 'react';
import { Stack, Typography, Chip, Box } from '@mui/material';
import { Translate, ArrowRightAlt } from '@mui/icons-material';
import ResultsTable from './ResultsTable';
import { dataAPI } from '../services/api';

const columns = [
  {
    id: 'source_lang', label: 'Languages', sortable: false,
    render: row => (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Chip label={row.source_lang || '—'} size="small" variant="outlined" />
        <ArrowRightAlt sx={{ fontSize: 16, color: 'text.disabled' }} />
        <Chip label={row.target_lang || row.target_langs?.[0] || '—'} size="small" color="primary" variant="outlined" />
      </Stack>
    ),
  },
  {
    id: 'date', label: 'Date',
    render: row => row.date ? new Date(row.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—',
  },
];

export default function TranslationsTable() {
  return (
    <ResultsTable
      fetchFn={id => dataAPI.getTranslations(id)}
      columns={columns}
      viewPath={id => `/dashboard/ttdata/${id}`}
      searchPlaceholder="Search translations…"
      emptyTitle="No translations yet"
      emptySubtitle="Translate text or documents and your results will appear here."
    />
  );
}

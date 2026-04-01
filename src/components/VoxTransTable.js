import React from 'react';
import { Stack, Chip, Typography, Box } from '@mui/material';
import { Translate } from '@mui/icons-material';
import ResultsTable from './ResultsTable';
import { dataAPI } from '../services/api';

const columns = [
  {
    id: 'source_lang', label: 'Source',
    render: row => (
      <Chip 
        icon={<Translate sx={{ fontSize: '14px !important' }} />} 
        label={(row.source_lang || 'en').toUpperCase()} 
        size="small" 
        color="primary" 
        variant="outlined" 
        sx={{ borderRadius: '6px', fontWeight: 600 }}
      />
    ),
  },
  {
    id: 'translations', label: 'Translations',
    render: row => {
       const trans = row.translations || row.Translations || {};
       const transEntries = Object.entries(trans);
       if (transEntries.length === 0) return <Typography variant="caption" color="text.disabled">—</Typography>;
       
       return (
         <Stack spacing={0.5}>
           {transEntries.slice(0, 2).map(([lang, text]) => (
             <Box key={lang}>
               <Typography variant="caption" sx={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.65rem' }}>{lang.toUpperCase()}:</Typography>
               <Typography variant="body2" noWrap sx={{ maxWidth: 200, color: 'text.secondary', fontSize: '0.8rem' }}>
                 {typeof text === 'string' ? text : (Array.isArray(text) ? text.map(t => t.text).join(' ') : '—')}
               </Typography>
             </Box>
           ))}
           {transEntries.length > 2 && (
             <Typography variant="caption" color="text.disabled">+{transEntries.length - 2} more</Typography>
           )}
         </Stack>
       );
    }
  },
  {
    id: 'Date', label: 'Date',
    render: row => row.Date ? new Date(row.Date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—',
  },
];

export default function VoxTransTable() {
  return (
    <ResultsTable
      fetchFn={id => dataAPI.getVoices(id)}
      columns={columns}
      viewPath={id => `/dashboard/voice/${id}`}
      collectionName="vvstore"
      searchPlaceholder="Search voice records…"
      emptyTitle="No voice translations"
      emptySubtitle="Translate your voice in real-time to see records here."
      dateKey="Date"
    />
  );
}
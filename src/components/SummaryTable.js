import React from 'react';
import { Chip } from '@mui/material';
import ResultsTable from './ResultsTable';
import VaultDateCell from './VaultDateCell';
import { TitleCell, LangChip, MetaText } from './vault/VaultTableCells';
import { defaultVaultSearch, truncateText } from '../utils/mediaVault';
import { dataAPI } from '../services/api';
import { VAULT_CACHE_KEYS } from '../utils/vaultCache';

const fetchSummaries = (id) => dataAPI.getSummaries(id);

const columns = [
  {
    id: 'title', label: 'Title', sortable: true,
    render: row => <TitleCell row={row} />,
  },
  {
    id: 'type', label: 'Input', sortable: false,
    render: row => (
      <Chip label={row.type || 'text'} size="small" variant="outlined" sx={{ fontSize: '0.72rem', height: 22, textTransform: 'capitalize' }} />
    ),
  },
  {
    id: 'source_lang', label: 'Language', sortable: false,
    render: row => <LangChip code={row.source_lang} />,
  },
  {
    id: 'summary', label: 'Preview', sortable: false,
    render: row => <MetaText>{truncateText(row.summary || row.text, 72)}</MetaText>,
  },
  {
    id: 'date', label: 'Date', sortable: true,
    render: row => <VaultDateCell row={row} />,
  },
];

export default function SummaryTable({ refreshKey }) {
  return (
    <ResultsTable
      fetchFn={fetchSummaries}
      cacheKey={VAULT_CACHE_KEYS.summary}
      columns={columns}
      viewPath={id => `/dashboard/summarydata/${id}`}
      collectionName="summary"
      studioPath="/dashboard/summarize"
      emptyActionLabel="Open Summarization Studio"
      searchFilter={defaultVaultSearch}
      searchPlaceholder="Search summaries…"
      emptyTitle="No summaries yet"
      emptySubtitle="Summarize text, audio, or documents and they'll appear here."
      refreshKey={refreshKey}
    />
  );
}

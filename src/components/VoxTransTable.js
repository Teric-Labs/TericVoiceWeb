import React from 'react';
import { Box, Typography } from '@mui/material';
import ResultsTable from './ResultsTable';
import VaultDateCell from './VaultDateCell';
import { TitleCell, LangChip, MetaText } from './vault/VaultTableCells';
import { defaultVaultSearch, truncateText } from '../utils/mediaVault';
import { dataAPI } from '../services/api';
import { VAULT_CACHE_KEYS } from '../utils/vaultCache';

const fetchVox = (id) => dataAPI.getVoices(id);

const columns = [
  {
    id: 'title', label: 'Session', sortable: true,
    render: row => <TitleCell row={row} />,
  },
  {
    id: 'source_lang', label: 'Source', sortable: false,
    render: row => <LangChip code={row.source_lang} />,
  },
  {
    id: 'translations', label: 'Outputs', sortable: false,
    render: row => {
      const trans = row.translations || row.Translations || {};
      const langs = Object.keys(trans);
      if (!langs.length) return <MetaText>—</MetaText>;
      const previewLang = langs[0];
      const text = trans[previewLang];
      const snippet = typeof text === 'string'
        ? truncateText(text, 48)
        : Array.isArray(text)
          ? truncateText(text.map(t => t?.text).filter(Boolean).join(' '), 48)
          : '—';
      return (
        <Box sx={{ minWidth: 0, maxWidth: 260 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#E8A020', fontSize: '0.65rem' }}>
            {langs.length} language{langs.length !== 1 ? 's' : ''}
          </Typography>
          <MetaText>{snippet}</MetaText>
        </Box>
      );
    },
  },
  {
    id: 'Date', label: 'Date', sortable: true,
    render: row => <VaultDateCell row={row} dateKey="Date" />,
  },
];

export default function VoxTransTable({ refreshKey }) {
  return (
    <ResultsTable
      fetchFn={fetchVox}
      cacheKey={VAULT_CACHE_KEYS.vox}
      columns={columns}
      viewPath={id => `/dashboard/voice/${id}`}
      collectionName="vvstore"
      studioPath="/dashboard/voxtrans"
      emptyActionLabel="Open Voice to Voice"
      searchFilter={defaultVaultSearch}
      searchPlaceholder="Search voice records…"
      emptyTitle="No voice translations"
      emptySubtitle="Translate your voice in real-time to see records here."
      dateKey="Date"
      sortKey="Date"
      refreshKey={refreshKey}
    />
  );
}

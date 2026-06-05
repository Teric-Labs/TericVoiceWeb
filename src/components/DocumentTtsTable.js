import React from 'react';
import ResultsTable from './ResultsTable';
import VaultDateCell from './VaultDateCell';
import { TitleCell, LangChip } from './vault/VaultTableCells';
import { defaultVaultSearch } from '../utils/mediaVault';
import { dataAPI } from '../services/api';
import { VAULT_CACHE_KEYS } from '../utils/vaultCache';

const fetchDocTts = (id) => dataAPI.getDocumentVoices(id);

const columns = [
  {
    id: 'title', label: 'Document', sortable: true,
    render: row => (
      <TitleCell
        row={row}
        subtitle={row.filename && row.filename !== row.title ? row.filename : undefined}
      />
    ),
  },
  {
    id: 'source_lang', label: 'Language', sortable: false,
    render: row => <LangChip code={row.source_lang} />,
  },
  {
    id: 'date', label: 'Date', sortable: true,
    render: row => <VaultDateCell row={row} dateKey="date" />,
  },
];

export default function DocumentTtsTable({ refreshKey }) {
  return (
    <ResultsTable
      fetchFn={fetchDocTts}
      cacheKey={VAULT_CACHE_KEYS.document_tts}
      columns={columns}
      viewPath={() => null}
      collectionName="translated_documents_with_tts"
      studioPath="/dashboard/synthesize"
      emptyActionLabel="Open Synthesis Studio"
      searchFilter={defaultVaultSearch}
      searchPlaceholder="Search document speech…"
      emptyTitle="No document speech yet"
      emptySubtitle="Upload a document in Synthesis Studio to generate audio."
      refreshKey={refreshKey}
    />
  );
}

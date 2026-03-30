import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Checkbox, TextField, IconButton, CircularProgress,
  Typography, Button, Tooltip, TableSortLabel, Snackbar, Alert,
  Menu, MenuItem, Stack, InputAdornment, ListItemIcon, Select, FormControl,
} from '@mui/material';
import {
  Delete, Share, Visibility, Search, MoreVert,
  InboxOutlined, Refresh as RefreshIcon, ErrorOutline,
  FileDownload as DownloadIcon, CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import ReactPaginate from 'react-paginate';
import './Pagination.css';
import Skeleton from '@mui/material/Skeleton';

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');

/**
 * Generic reusable data table.
 *
 * Props:
 *   fetchFn(userId) → Promise<{ entries: [] }>
 *   columns: [{ id, label, render(row) }]
 *   viewPath: (id) => string   — navigation on row click / "view"
 *   searchFilter: (entry, query) => bool
 *   searchPlaceholder: string
 *   emptyTitle: string
 *   emptySubtitle: string
 *   sortKey: string  — default sort field (default "date")
 *   dateKey: string  — key used for date sorting (default "date")
 */
export default function ResultsTable({
  fetchFn,
  columns,
  viewPath,
  searchFilter,
  searchPlaceholder = 'Search…',
  emptyTitle = 'No results yet',
  emptySubtitle = 'Your processed files will appear here.',
  sortKey = 'date',
  dateKey = 'date',
}) {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(PAGE_SIZE_OPTIONS[0]);
  const [orderBy, setOrderBy] = useState(sortKey);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [anchor, setAnchor] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'info' });
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);

  const notify = (msg, sev = 'success') => setSnack({ open: true, msg, sev });

  const fetchData = useCallback(async () => {
    const { uid, userId } = getUser();
    const id = uid || userId;
    if (!id) { setLoading(false); return; }
    setLoading(true);
    setLoadError(false);
    try {
      const res = await fetchFn(id);
      setEntries(res?.entries || []);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ---- Sorting ---- */
  const handleSort = (field) => {
    setOrder(orderBy === field && order === 'asc' ? 'desc' : 'asc');
    setOrderBy(field);
  };

  /* ---- Select ---- */
  const toggleSelectAll = (e) =>
    setSelected(e.target.checked ? entries.map(r => r.doc_id) : []);

  const toggleSelect = (id) =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  /* ---- CSV export ---- */
  const exportCSV = () => {
    if (filtered.length === 0) return;
    const headers = columns.map(c => c.label).join(',');
    const rows = filtered.map(r =>
      columns.map(c => {
        const val = r[c.id] ?? '';
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    ).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'export.csv'; a.click();
    URL.revokeObjectURL(url);
    notify('CSV exported');
  };

  /* ---- Filtered + sorted + paginated ---- */
  const filtered = entries.filter(r => {
    if (filter && !(searchFilter ? searchFilter(r, filter) : (r.title || '').toLowerCase().includes(filter.toLowerCase()))) return false;
    if (dateFrom || dateTo) {
      const d = new Date(r[dateKey] || 0);
      if (dateFrom && d < new Date(dateFrom)) return false;
      if (dateTo && d > new Date(dateTo + 'T23:59:59')) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (orderBy === dateKey) {
      const da = new Date(a[dateKey] || 0), db = new Date(b[dateKey] || 0);
      return order === 'asc' ? da - db : db - da;
    }
    const va = (a[orderBy] || '').toString();
    const vb = (b[orderBy] || '').toString();
    return order === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const displayed = sorted.slice(page * perPage, (page + 1) * perPage);

  /* ---- Actions ---- */
  const handleView = useCallback((id) => navigate(viewPath(id)), [navigate, viewPath]);

  const handleMenuAction = (action) => {
    if (action === 'view') handleView(activeRow?.doc_id);
    if (action === 'delete') {
      setEntries(prev => prev.filter(r => r.doc_id !== activeRow?.doc_id));
      notify('Item removed');
    }
    if (action === 'share') notify('Share link copied to clipboard');
    setAnchor(null);
    setActiveRow(null);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ width: '100%', p: 2.5, borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Toolbar */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
          <TextField
            fullWidth size="small"
            placeholder={searchPlaceholder}
            value={filter}
            onChange={e => { setFilter(e.target.value); setPage(0); }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment>,
              sx: { borderRadius: 1.5 },
            }}
          />
          {selected.length > 0 && (
            <Button size="small" variant="outlined" color="error" startIcon={<Delete />}
              onClick={() => {
                setEntries(prev => prev.filter(r => !selected.includes(r.doc_id)));
                setSelected([]);
                notify(`${selected.length} items removed`);
              }}>
              Delete ({selected.length})
            </Button>
          )}
          <Tooltip title="Filter by date">
            <IconButton size="small" onClick={() => setShowDateFilter(v => !v)}
              sx={{ flexShrink: 0, color: (dateFrom || dateTo) ? 'primary.main' : 'inherit' }}>
              <CalendarIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export CSV">
            <IconButton size="small" onClick={exportCSV} sx={{ flexShrink: 0 }}>
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <FormControl size="small" sx={{ minWidth: 90, flexShrink: 0 }}>
            <Select
              value={perPage}
              onChange={e => { setPerPage(Number(e.target.value)); setPage(0); }}
              sx={{ borderRadius: 1.5, fontSize: '0.85rem' }}
            >
              {PAGE_SIZE_OPTIONS.map(n => (
                <MenuItem key={n} value={n}>{n} / page</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        {showDateFilter && (
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <TextField size="small" type="date" label="From" value={dateFrom}
              onChange={e => { setDateFrom(e.target.value); setPage(0); }}
              InputLabelProps={{ shrink: true }}
              sx={{ borderRadius: 1.5, minWidth: 160 }}
            />
            <TextField size="small" type="date" label="To" value={dateTo}
              onChange={e => { setDateTo(e.target.value); setPage(0); }}
              InputLabelProps={{ shrink: true }}
              sx={{ borderRadius: 1.5, minWidth: 160 }}
            />
            {(dateFrom || dateTo) && (
              <Button size="small" variant="text" onClick={() => { setDateFrom(''); setDateTo(''); setPage(0); }}>
                Clear
              </Button>
            )}
          </Stack>
        )}

        {/* Content */}
        {loading ? (
          <Box sx={{ px: 1, pt: 1 }}>
            {[...Array(5)].map((_, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, py: 0.5 }}>
                <Skeleton variant="rectangular" width={18} height={18} sx={{ borderRadius: '4px', bgcolor: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />
                <Skeleton variant="text" sx={{ flex: 1, height: 20, bgcolor: 'rgba(255,255,255,0.05)' }} />
                <Skeleton variant="text" width={100} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                <Skeleton variant="text" width={80} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                <Skeleton variant="circular" width={28} height={28} sx={{ bgcolor: 'rgba(255,255,255,0.05)', flexShrink: 0 }} />
              </Box>
            ))}
          </Box>
        ) : loadError ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, textAlign: 'center' }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'error.50', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <ErrorOutline sx={{ fontSize: 28, color: 'error.main' }} />
            </Box>
            <Typography variant="subtitle1" fontWeight={600} mb={0.5}>Failed to load data</Typography>
            <Typography variant="body2" color="text.secondary" mb={2.5}>
              There was a problem fetching your data. Check your connection and try again.
            </Typography>
            <Button variant="contained" size="small" startIcon={<RefreshIcon />} onClick={fetchData}
              sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}>
              Retry
            </Button>
          </Box>
        ) : filtered.length === 0 ? (
          /* ---- Empty State ---- */
          <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            py: 8, px: 2, textAlign: 'center',
          }}>
            <Box sx={{
              width: 64, height: 64, borderRadius: '50%', bgcolor: 'grey.100',
              display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2,
            }}>
              <InboxOutlined sx={{ fontSize: 32, color: 'text.disabled' }} />
            </Box>
            <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
              {filter ? 'No matching results' : emptyTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2.5} maxWidth={320}>
              {filter ? `No results for "${filter}". Try a different search.` : emptySubtitle}
            </Typography>
            {!filter && (
              <Button variant="contained" size="small" onClick={() => navigate('/dashboard')}
                sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}>
                Go to Dashboard
              </Button>
            )}
          </Box>
        ) : (
          <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {page * perPage + 1}–{Math.min((page + 1) * perPage, filtered.length)} of {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </Typography>
            </Stack>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& .MuiTableCell-head': { fontWeight: 600, fontSize: '0.8rem', color: 'text.secondary', bgcolor: 'grey.50' } }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        indeterminate={selected.length > 0 && selected.length < entries.length}
                        checked={entries.length > 0 && selected.length === entries.length}
                        onChange={toggleSelectAll}
                      />
                    </TableCell>
                    {columns.map(col => (
                      <TableCell key={col.id}>
                        {col.sortable !== false ? (
                          <TableSortLabel
                            active={orderBy === col.id}
                            direction={orderBy === col.id ? order : 'asc'}
                            onClick={() => handleSort(col.id)}
                          >
                            {col.label}
                          </TableSortLabel>
                        ) : col.label}
                      </TableCell>
                    ))}
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayed.map(row => (
                    <TableRow
                      key={row.doc_id} hover
                      selected={selected.includes(row.doc_id)}
                      sx={{ cursor: 'pointer', '&:last-child td': { border: 0 } }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox size="small" checked={selected.includes(row.doc_id)}
                          onChange={() => toggleSelect(row.doc_id)}
                          onClick={e => e.stopPropagation()} />
                      </TableCell>
                      {columns.map(col => (
                        <TableCell key={col.id} onClick={() => handleView(row.doc_id)}>
                          {col.render ? col.render(row) : (
                            <Typography variant="body2">{row[col.id] ?? '—'}</Typography>
                          )}
                        </TableCell>
                      ))}
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="View">
                            <IconButton size="small" onClick={() => handleView(row.doc_id)}>
                              <Visibility sx={{ fontSize: 18, color: '#0ea5e9' }} />
                            </IconButton>
                          </Tooltip>
                          <IconButton size="small" onClick={e => { setAnchor(e.currentTarget); setActiveRow(row); }}>
                            <MoreVert sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {filtered.length > perPage && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2.5 }}>
                <ReactPaginate
                  previousLabel="Previous" nextLabel="Next" breakLabel="..."
                  pageCount={Math.ceil(filtered.length / perPage)}
                  forcePage={page}
                  marginPagesDisplayed={1} pageRangeDisplayed={3}
                  onPageChange={({ selected: p }) => setPage(p)}
                  containerClassName="pagination" activeClassName="active"
                  previousClassName="page-item" nextClassName="page-item"
                  pageClassName="page-item" breakClassName="page-item"
                  pageLinkClassName="page-link" previousLinkClassName="page-link"
                  nextLinkClassName="page-link" breakLinkClassName="page-link"
                  activeLinkClassName="active-link"
                />
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Row context menu */}
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { borderRadius: 1.5, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', minWidth: 160 } }}>
        <MenuItem onClick={() => handleMenuAction('view')} sx={{ fontSize: '0.875rem' }}>
          <ListItemIcon><Visibility fontSize="small" /></ListItemIcon> View
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('share')} sx={{ fontSize: '0.875rem' }}>
          <ListItemIcon><Share fontSize="small" /></ListItemIcon> Share
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')} sx={{ fontSize: '0.875rem', color: 'error.main' }}>
          <ListItemIcon><Delete fontSize="small" color="error" /></ListItemIcon> Delete
        </MenuItem>
      </Menu>

      <Snackbar open={snack.open} autoHideDuration={4000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.sev} variant="filled" onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

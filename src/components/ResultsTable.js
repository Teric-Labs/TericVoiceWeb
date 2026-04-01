import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Checkbox, TextField, IconButton, CircularProgress,
  Typography, Button, Tooltip, TableSortLabel, Snackbar, Alert,
  Menu, MenuItem, Stack, InputAdornment, ListItemIcon, Select, FormControl,
  useMediaQuery, useTheme, Card, Divider
} from '@mui/material';
import {
  Delete, Share, Visibility, Search, MoreVert,
  InboxOutlined, Refresh as RefreshIcon, ErrorOutline,
  FileDownload as DownloadIcon, CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import ReactPaginate from 'react-paginate';
import './Pagination.css';
import Skeleton from '@mui/material/Skeleton';
import { dataAPI } from '../services/api';

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');

export default function ResultsTable({
  fetchFn,
  columns,
  viewPath,
  collectionName,
  searchFilter,
  searchPlaceholder = 'Search…',
  emptyTitle = 'No results yet',
  emptySubtitle = 'Your processed files will appear here.',
  sortKey = 'date',
  dateKey = 'date',
}) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
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
      setEntries(Array.isArray(res?.entries) ? res.entries : []);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSort = (field) => {
    setOrder(orderBy === field && order === 'asc' ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const toggleSelectAll = (e) =>
    setSelected(e.target.checked ? entries.map(r => r.doc_id) : []);

  const toggleSelect = (id) =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

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

  const filtered = useMemo(() => {
    return entries.filter(r => {
      if (filter && !(searchFilter ? searchFilter(r, filter) : (r.title || '').toLowerCase().includes(filter.toLowerCase()))) return false;
      if (dateFrom || dateTo) {
        const d = new Date(r[dateKey] || 0);
        if (dateFrom && d < new Date(dateFrom)) return false;
        if (dateTo && d > new Date(dateTo + 'T23:59:59')) return false;
      }
      return true;
    });
  }, [entries, filter, searchFilter, dateFrom, dateTo, dateKey]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (orderBy === dateKey) {
        const da = new Date(a[dateKey] || 0), db = new Date(b[dateKey] || 0);
        return order === 'asc' ? da - db : db - da;
      }
      const va = (a[orderBy] || '').toString();
      const vb = (b[orderBy] || '').toString();
      return order === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [filtered, orderBy, order, dateKey]);

  const displayed = useMemo(() => sorted.slice(page * perPage, (page + 1) * perPage), [sorted, page, perPage]);

  const handleView = useCallback((id) => navigate(viewPath(id)), [navigate, viewPath]);

  const handleMenuAction = async (action) => {
    if (action === 'view') handleView(activeRow?.doc_id);
    if (action === 'delete' && activeRow) {
      if (window.confirm('Are you sure you want to permanently delete this record?')) {
        try {
          const coll = activeRow.collection || collectionName;
          if (!coll) { notify('Error: Collection name missing', 'error'); return; }
          await dataAPI.deleteRecord(coll, activeRow.doc_id);
          setEntries(prev => prev.filter(r => r.doc_id !== activeRow.doc_id));
          notify('Record deleted permanently');
        } catch (err) {
          console.error('[ResultsTable] Delete failed:', err);
          notify('Failed to delete record', 'error');
        }
      }
    }
    if (action === 'share') notify('Share link copied to clipboard');
    setAnchor(null);
    setActiveRow(null);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ width: '100%', p: { xs: 1.5, md: 2.5 }, borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Toolbar */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ mb: 2.5 }}>
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
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
            {selected.length > 0 && (
              <Button size="small" variant="outlined" color="error" startIcon={<Delete />}
                sx={{ whiteSpace: 'nowrap' }}
                onClick={async () => {
                  if (window.confirm(`Are you sure you want to permanently delete ${selected.length} records?`)) {
                    try {
                      await Promise.all(selected.map(id => {
                        const row = entries.find(r => r.doc_id === id);
                        const coll = row?.collection || collectionName;
                        return dataAPI.deleteRecord(coll, id);
                      }));
                      setEntries(prev => prev.filter(r => !selected.includes(r.doc_id)));
                      setSelected([]);
                      notify(`${selected.length} items deleted permanently`);
                    } catch (err) {
                      notify('Failed to delete some items', 'error');
                    }
                  }
                }}>
                Del ({selected.length})
              </Button>
            )}
            <Tooltip title="Filter by date">
              <IconButton size="small" onClick={() => setShowDateFilter(v => !v)}
                sx={{ flexShrink: 0, color: (dateFrom || dateTo) ? 'primary.main' : 'inherit' }}>
                <CalendarIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {!isMobile && (
              <Tooltip title="Export CSV">
                <IconButton size="small" onClick={exportCSV} sx={{ flexShrink: 0 }}>
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <FormControl size="small" sx={{ minWidth: 90, flexShrink: 0 }}>
              <Select
                value={perPage}
                onChange={e => { setPerPage(Number(e.target.value)); setPage(0); }}
                sx={{ borderRadius: 1.5, fontSize: '0.85rem' }}
              >
                {PAGE_SIZE_OPTIONS.map(n => (
                  <MenuItem key={n} value={n}>{n}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        {showDateFilter && (
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <TextField size="small" type="date" label="From" value={dateFrom}
              onChange={e => { setDateFrom(e.target.value); setPage(0); }}
              InputLabelProps={{ shrink: true }}
              sx={{ borderRadius: 1.5, minWidth: 140, flex: 1 }}
            />
            <TextField size="small" type="date" label="To" value={dateTo}
              onChange={e => { setDateTo(e.target.value); setPage(0); }}
              InputLabelProps={{ shrink: true }}
              sx={{ borderRadius: 1.5, minWidth: 140, flex: 1 }}
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
                <Skeleton variant="circular" width={28} height={28} sx={{ bgcolor: 'rgba(255,255,255,0.05)', flexShrink: 0 }} />
              </Box>
            ))}
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, px: 2, textAlign: 'center' }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <InboxOutlined sx={{ fontSize: 32, color: 'text.disabled' }} />
            </Box>
            <Typography variant="subtitle1" fontWeight={600} mb={0.5}>{filter ? 'No results' : emptyTitle}</Typography>
            <Typography variant="body2" color="text.secondary" mb={2.5}>{filter ? `No results for "${filter}"` : emptySubtitle}</Typography>
          </Box>
        ) : isMobile ? (
          /* ---- Mobile Card View ---- */
          <Stack spacing={2}>
            {displayed.map(row => (
              <Card key={row.doc_id} sx={{ 
                p: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px',
                '&:hover': { background: 'rgba(255,255,255,0.04)' }
              }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                  <Checkbox size="small" checked={selected.includes(row.doc_id)} onChange={() => toggleSelect(row.doc_id)} sx={{ p: 0.5 }} />
                  <Stack direction="row" spacing={0.5}>
                    <IconButton size="small" onClick={() => handleView(row.doc_id)}><Visibility sx={{ fontSize: 18, color: '#0ea5e9' }} /></IconButton>
                    <IconButton size="small" onClick={e => { setAnchor(e.currentTarget); setActiveRow(row); }}><MoreVert sx={{ fontSize: 18 }} /></IconButton>
                  </Stack>
                </Stack>
                <Box onClick={() => handleView(row.doc_id)} sx={{ cursor: 'pointer' }}>
                  {columns.map(col => (
                    <Box key={col.id} sx={{ mb: 1.5, '&:last-child': { mb: 0 } }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 0.3 }}>
                        {col.label}
                      </Typography>
                      {col.render ? col.render(row) : <Typography variant="body2" sx={{ color: '#f8fafc' }}>{row[col.id] || '—'}</Typography>}
                    </Box>
                  ))}
                </Box>
              </Card>
            ))}
          </Stack>
        ) : (
          /* ---- Desktop Table View ---- */
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& .MuiTableCell-head': { fontWeight: 700, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.05)' } }}>
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
                          sx={{ '&.Mui-active': { color: '#0ea5e9' }, '& .MuiTableSortLabel-icon': { color: '#0ea5e9 !important' } }}
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
                    sx={{ 
                      cursor: 'pointer', 
                      '&.Mui-selected, &.Mui-selected:hover': { background: 'rgba(14,165,233,0.05)' },
                      '& .MuiTableCell-root': { borderBottom: '1px solid rgba(255,255,255,0.03)' }
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox size="small" checked={selected.includes(row.doc_id)}
                        onChange={() => toggleSelect(row.doc_id)}
                        onClick={e => e.stopPropagation()} />
                    </TableCell>
                    {columns.map(col => (
                      <TableCell key={col.id} onClick={() => handleView(row.doc_id)}>
                        {col.render ? col.render(row) : (
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>{row[col.id] ?? '—'}</Typography>
                        )}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="View Result">
                          <IconButton size="small" onClick={() => handleView(row.doc_id)}>
                            <Visibility sx={{ fontSize: 18, color: '#0ea5e9' }} />
                          </IconButton>
                        </Tooltip>
                        <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.2)' }} onClick={e => { setAnchor(e.currentTarget); setActiveRow(row); }}>
                          <MoreVert sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {filtered.length > perPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <ReactPaginate
              previousLabel="Prev" nextLabel="Next" breakLabel="..."
              pageCount={Math.ceil(filtered.length / perPage)}
              forcePage={page}
              marginPagesDisplayed={isMobile ? 0 : 1} pageRangeDisplayed={isMobile ? 2 : 3}
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
      </Box>

      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { background: '#0a0a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1.5, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', minWidth: 160 } }}>
        <MenuItem onClick={() => handleMenuAction('view')} sx={{ fontSize: '0.875rem', py: 1, color: '#f8fafc' }}>
          <ListItemIcon><Visibility fontSize="small" sx={{ color: '#0ea5e9' }} /></ListItemIcon> View Link
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('share')} sx={{ fontSize: '0.875rem', py: 1, color: '#f8fafc' }}>
          <ListItemIcon><Share fontSize="small" sx={{ color: '#8b5cf6' }} /></ListItemIcon> Share Link
        </MenuItem>
        <Divider sx={{ opacity: 0.1 }} />
        <MenuItem onClick={() => handleMenuAction('delete')} sx={{ fontSize: '0.875rem', py: 1, color: '#f43f5e' }}>
          <ListItemIcon><Delete fontSize="small" color="error" /></ListItemIcon> Delete Forever
        </MenuItem>
      </Menu>

      <Snackbar open={snack.open} autoHideDuration={4000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack.sev} variant="filled" onClose={() => setSnack(s => ({ ...s, open: false }))} sx={{ borderRadius: '12px' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

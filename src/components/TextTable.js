import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  IconButton,
  CircularProgress,
  Typography,
  Button,
  Tooltip,
  TableSortLabel,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Stack,
  InputAdornment,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon,
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  TextFields as TextFieldsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './Pagination.css';

export default function TextTable() {
  const [filter, setFilter] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [user, setUser] = useState({ username: '', userId: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const entriesPerPage = 10;
  const navigate = useNavigate();

  const handleVisibilityClick = useCallback((id) => {
    navigate(`/dashboard/tts/${id}`);
  }, [navigate]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setActiveRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveRow(null);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = entries.map((n) => n.doc_id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleCheckboxClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const fetchEntries = useCallback(async () => {

    if (!user.userId) {
      console.error('Invalid user ID format');
      setLoading(false);
      return;
    }
    const apiEndpoint = 'https://avoicesfinny-13747549899.us-central1.run.app/get_vocify_voices';
    try {
      
      const response = await axios.post(apiEndpoint, { user_id: user.userId });
      const entriesData = response.data.entries || [];
      setEntries(entriesData);
    } catch (error) {
      console.error('Failed to fetch entries', error);
      setSnackbar({ open: true, message: 'Failed to fetch entries', severity: 'error' });
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    if (entries.length > 0) {
      console.log('First entry structure:', entries[0]);
    }
  }, [entries]);

  const handleShare = async (id) => {
    try {
      setSnackbar({ open: true, message: 'Share link copied to clipboard', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Share failed', severity: 'error' });
    }
    handleMenuClose();
  };

  const handleDelete = async (id) => {
    try {
      setSnackbar({ open: true, message: 'Text entry deleted successfully', severity: 'success' });
      fetchEntries();
    } catch (error) {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
    handleMenuClose();
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const filteredEntries = Array.isArray(entries) ? entries.filter((entry) => {
    const searchTerm = filter.toLowerCase();
    return (
      (entry?.title || '').toLowerCase().includes(searchTerm) ||
      (entry?.original_text || '').toLowerCase().includes(searchTerm) ||
      (entry?.translations_with_tts?.en?.translation || '').toLowerCase().includes(searchTerm)
    );
  }) : [];

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (orderBy === 'date') {
      return order === 'asc' 
        ? new Date(a.date || 0) - new Date(b.date || 0)
        : new Date(b.date || 0) - new Date(a.date || 0);
    }
    const aValue = (a[orderBy] || '').toString();
    const bValue = (b[orderBy] || '').toString();
    return order === 'asc' 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const displayedEntries = sortedEntries.slice(
    currentPage * entriesPerPage,
    (currentPage + 1) * entriesPerPage
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search texts..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            size="small"
          />
          {selected.length > 0 && (
            <Button
              variant="contained"
              startIcon={<ShareIcon />}
              onClick={() => handleShare(selected)}
              sx={{ minWidth: 'auto' }}
            >
              Share Selected
            </Button>
          )}
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : filteredEntries.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
            <Typography variant="h6" gutterBottom>No text entries found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {entries.length === 0 ? 'No entries available' : 'No matching entries found'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table aria-label="text entries table">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selected.length > 0 && selected.length < entries.length}
                        checked={entries.length > 0 && selected.length === entries.length}
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'title'}
                        direction={orderBy === 'title' ? order : 'asc'}
                        onClick={() => handleSort('title')}
                      >
                        Title
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Source Language</TableCell>
                    <TableCell>Original Text</TableCell>
                    <TableCell>Translation</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'date'}
                        direction={orderBy === 'date' ? order : 'asc'}
                        onClick={() => handleSort('date')}
                      >
                        Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedEntries.map((entry) => {
                    const isItemSelected = isSelected(entry.doc_id);
                    return (
                      <TableRow
                        key={entry.doc_id}
                        hover
                        selected={isItemSelected}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          cursor: 'pointer',
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            onChange={() => handleCheckboxClick(entry.doc_id)}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          onClick={() => handleVisibilityClick(entry.doc_id)}
                        >
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <TextFieldsIcon color="action" fontSize="small" />
                            <Typography variant="body2">{entry.title || 'Untitled'}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip label={entry.source_lang || 'N/A'} size="small" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {truncateText(entry.original_text)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {truncateText(entry.translations_with_tts?.en?.translation)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {entry.date ? new Date(entry.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'N/A'}
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="View Text">
                              <IconButton
                                size="small"
                                onClick={() => handleVisibilityClick(entry.doc_id)}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, entry)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={Math.ceil(filteredEntries.length / entriesPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={({ selected }) => setCurrentPage(selected)}
                containerClassName={"pagination"}
                activeClassName={"active"}
                previousClassName={"page-item"}
                nextClassName={"page-item"}
                pageClassName={"page-item"}
                breakClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousLinkClassName={"page-link"}
                nextLinkClassName={"page-link"}
                breakLinkClassName={"page-link"}
                activeLinkClassName={"active-link"}
              />
            </Box>
          </>
        )}
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleShare(activeRow?.doc_id)}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          Share
        </MenuItem>
        <MenuItem onClick={() => handleVisibilityClick(activeRow?.doc_id)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDelete(activeRow?.doc_id)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Chip,
  Stack,
  InputAdornment,
  ListItemIcon,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  CloudDownload as CloudDownloadIcon,
  FileCopy as FileCopyIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './Pagination.css';

export default function DataTable() {
  const [filter, setFilter] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [user, setUser] = useState({ username: '', userId: '' });
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const entriesPerPage = 10; // Increased from 5 to 10 for better usability
  const navigate = useNavigate();

  const handleVisibilityClick = useCallback((id) => {
    navigate(`/dashboard/audio/${id}`);
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
      return;
    }
    setSelected([]);
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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchEntries = useCallback(async () => {
    if (!user.userId) {
      console.error('Invalid user ID format');
      setLoading(false);
      return;
    }
    const apiEndpoint = 'https://agents.tericlab.com:8080/get_audios';
    try {
      
      const response = await axios.post(apiEndpoint, { user_id: user.userId });
      setEntries(response.data.entries.map(entry => ({
        ...entry,
        status: Math.random() > 0.5 ? 'completed' : 'processing' // Simulated status
      })));
    } catch (error) {
      console.error('Failed to fetch entries', error);
      setSnackbar({ open: true, message: 'Failed to fetch entries', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user.userId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleDownload = async (id) => {
    try {
      // Implement actual download logic here
      setSnackbar({ open: true, message: 'Download started', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Download failed', severity: 'error' });
    }
    handleMenuClose();
  };

  const handleDelete = async (id) => {
    try {
      // Implement actual delete logic here
      setSnackbar({ open: true, message: 'File deleted successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
    handleMenuClose();
  };

  const handleShare = async (id) => {
    try {
      // Implement actual share logic here
      setSnackbar({ open: true, message: 'Share link copied to clipboard', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Share failed', severity: 'error' });
    }
    handleMenuClose();
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      default:
        return 'default';
    }
  };

  const filteredEntries = entries.filter(audio => 
    audio.title.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedEntries = filteredEntries.sort((a, b) => {
    if (orderBy === 'date') {
      return order === 'asc' ? new Date(a.Date) - new Date(b.Date) : new Date(b.Date) - new Date(a.Date);
    }
    return order === 'asc' ? a[orderBy].localeCompare(b[orderBy]) : b[orderBy].localeCompare(a[orderBy]);
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
            placeholder="Search transcripts..."
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
              startIcon={<CloudDownloadIcon />}
              onClick={() => handleDownload(selected)}
              sx={{ minWidth: 'auto' }}
            >
              Download Selected
            </Button>
          )}
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : filteredEntries.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
            <Typography variant="h6" gutterBottom>No transcripts found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Try adjusting your search or upload new audio files
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
              <Table aria-label="audio transcripts table">
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
                        Audio Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Status</TableCell>
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
                  {displayedEntries.map((audio) => {
                    const isItemSelected = isSelected(audio.doc_id);
                    return (
                      <TableRow
                        key={audio.doc_id}
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
                            onChange={() => handleCheckboxClick(audio.doc_id)}
                          />
                        </TableCell>
                        <TableCell 
                          component="th" 
                          scope="row"
                          onClick={() => handleVisibilityClick(audio.doc_id)}
                        >
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <FileCopyIcon color="action" fontSize="small" />
                            <Typography variant="body2">{audio.title}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={audio.status}
                            size="small"
                            color={getStatusChipColor(audio.status)}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(audio.Date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="View Transcript">
                              <IconButton
                                size="small"
                                onClick={() => handleVisibilityClick(audio.doc_id)}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, audio)}
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
        <MenuItem onClick={() => handleDownload(activeRow?.doc_id)}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          Download
        </MenuItem>
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
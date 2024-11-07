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
  Alert
} from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReactPaginate from 'react-paginate';
import './Pagination.css';

export default function TranslationsTable() {
  const [filter, setFilter] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [user, setUser] = useState({ username: '', userId: '' });
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const entriesPerPage = 5;
  const navigate = useNavigate();

  const handleVisibilityClick = useCallback((id) => {
    navigate(`/dashboard/ttdata/${id}`);
  }, [navigate]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  const fetchEntries = useCallback(async () => {
    if (!user.userId) {
      console.error('Invalid user ID format');
      setLoading(false);
      return;
    }
    const apiEndpoint = 'http://127.0.0.1:8000/get_translations';
    try {
      const response = await axios.post(apiEndpoint, { user_id: user.userId });
      setEntries(response.data.entries);
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

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const filteredEntries = entries.filter(audio => 
    audio.Original_transcript.toLowerCase().includes(filter.toLowerCase())
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

  const handleDelete = async (id) => {
    setSnackbar({ open: true, message: 'Delete functionality not implemented', severity: 'warning' });
  };

  const handleShare = async (id) => {
    setSnackbar({ open: true, message: 'Share functionality not implemented', severity: 'warning' });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search by Language"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ mb: 2 }}
        />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : filteredEntries.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
            <Typography variant="h6" gutterBottom>No translations found</Typography>
            <Button
              variant="contained"
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{ mt: 2 }}
            >
              Return to Dashboard
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table aria-label="translations table">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={false}
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
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'source_lang'}
                        direction={orderBy === 'source_lang' ? order : 'asc'}
                        onClick={() => handleSort('source_lang')}
                      >
                        Source Language
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      Target Languages
                    </TableCell>
                    <TableCell align="right">
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
                  {displayedEntries.map((translation) => (
                    <TableRow
                      key={translation.doc_id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {translation.title}
                      </TableCell>
                      <TableCell>{translation.source_lang}</TableCell>
                      <TableCell>{translation.Translations && Object.keys(translation.Translations).join(", ")}</TableCell>
                      <TableCell align="right">{new Date(translation.Date).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="View Transcript">
                          <IconButton onClick={() => handleVisibilityClick(translation.doc_id)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Share">
                          <IconButton onClick={() => handleShare(translation.doc_id)}>
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDelete(translation.doc_id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={Math.ceil(filteredEntries.length / entriesPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

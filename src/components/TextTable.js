import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  Tooltip,
  TableSortLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReactPaginate from 'react-paginate';
import './Pagination.css';

export default function TextTable() {
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
    navigate(`/dashboard/tts/${id}`);
  }, [navigate]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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
    const apiEndpoint = 'https://teric-asr-api-wlivbm2klq-ue.a.run.app/et_tts_audios';
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

  const filteredEntries = entries.filter((audio) =>
    audio.Translation.toLowerCase().includes(filter.toLowerCase())
  ).map((audio) => ({
    ...audio,
    Translation: audio.Translation.length > 100 ? audio.Translation.substring(0, 100) + "..." : audio.Translation
  }));

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
    // Implement delete logic here
    setSnackbar({ open: true, message: 'Delete functionality not implemented', severity: 'warning' });
  };

  const handleShare = async (id) => {
    // Implement share logic here
    setSnackbar({ open: true, message: 'Share functionality not implemented', severity: 'warning' });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        variant="outlined"
        sx={{ fontFamily: 'Poppins', marginBottom: 2 }}
        label="Search by Audio Name"
        onChange={(e) => setFilter(e.target.value)}
      />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table aria-label="Generated Audios">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={false}
                      // Implement select all logic
                    />
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'title'}
                      direction={orderBy === 'title' ? order : 'asc'}
                      onClick={() => handleSort('title')}
                    >
                      Text Title
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'source_language'}
                      direction={orderBy === 'source_language' ? order : 'asc'}
                      onClick={() => handleSort('source_language')}
                    >
                      Source Language
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'target_language'}
                      direction={orderBy === 'target_language' ? order : 'asc'}
                      onClick={() => handleSort('target_language')}
                    >
                      Target Language
                    </TableSortLabel>
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
                  <TableCell align="right" sx={{ fontFamily: 'Poppins' }}>View Transcripts</TableCell>
                  <TableCell align="right" sx={{ fontFamily: 'Poppins' }}>Share</TableCell>
                  <TableCell align="right" sx={{ fontFamily: 'Poppins' }}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedEntries.map((audio) => (
                  <TableRow key={audio.doc_id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
                    <TableCell component="th" scope="row">
                      <Checkbox
                        // Implement row selection logic
                      />
                    </TableCell>
                    <TableCell align="left" sx={{ fontSize: '0.875rem', fontFamily: 'Poppins' }}>{audio.title}</TableCell>
                    <TableCell align="left" sx={{ fontSize: '0.875rem', fontFamily: 'Poppins' }}>{audio.source_language}</TableCell>
                    <TableCell align="left" sx={{ fontSize: '0.875rem', fontFamily: 'Poppins' }}>{audio.target_language}</TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.875rem', fontFamily: 'Poppins' }}>{audio.Date}</TableCell>
                    <TableCell align="right"><IconButton onClick={() => handleVisibilityClick(audio.doc_id)}><VisibilityIcon sx={{ color: 'gray', '&:hover': { color: 'black' } }} /></IconButton></TableCell>
                    <TableCell align="right"><IconButton onClick={() => handleShare(audio.doc_id)}><ShareIcon sx={{ color: 'blue', '&:hover': { color: 'darkblue' } }} /></IconButton></TableCell>
                    <TableCell align="right"><IconButton onClick={() => handleDelete(audio.doc_id)}><DeleteIcon sx={{ color: 'red', '&:hover': { color: 'darkred' } }} /></IconButton></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
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
              disabledClassName={"disabled"}
            />
          </Box>
        </>
      )}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

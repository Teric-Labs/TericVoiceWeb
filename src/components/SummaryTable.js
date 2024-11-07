import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
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
  Tooltip,
  Snackbar,
  Alert,
  TableSortLabel,
  Button
} from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function SummaryTable() {
  const [filter, setFilter] = useState('');
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const entriesPerPage = 5; 
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: '', userId: '' });

  const handleVisibilityClick = useCallback((id) => {
    console.log(`Visibility icon clicked for Summary ID: ${id}`);
    navigate(`/dashboard/summarydata/${id}`);
  }, [navigate]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    const apiEndpoint = 'http://127.0.0.1:8000/get_summaries';
    const fetchEntries = async () => {
      if (typeof user.userId !== 'string') {
        console.error('Invalid user ID format');
        setLoading(false);
        setSnackbar({ open: true, message: 'Invalid user ID format', severity: 'error' });
        return;
      }
      try {
        const response = await axios.post(apiEndpoint, { user_id: user.userId });
        setEntries(response.data.entries);
      } catch (error) {
        console.error('Failed to fetch entries', error);
        setSnackbar({ open: true, message: 'Failed to fetch entries', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [user.userId]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredEntries = entries.filter((audio) =>
    audio.Original_transcript.toLowerCase().includes(filter.toLowerCase())
  ).map((audio) => ({
    ...audio,
    Translation: audio.Original_transcript.length > 100 ? audio.Original_transcript.substring(0, 100) + "..." : audio.Original_transcript
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

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDelete = async (id) => {
    setSnackbar({ open: true, message: 'Delete functionality not implemented', severity: 'warning' });
  };

  const handleShare = async (id) => {
    setSnackbar({ open: true, message: 'Share functionality not implemented', severity: 'warning' });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ padding: 2 }}>
          <TextField 
            fullWidth 
            variant="outlined" 
            label="Search by Language" 
            onChange={(e) => setFilter(e.target.value)} 
            sx={{
              mb: 2,
              input: { color: 'white' },
              label: { color: 'gray' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray' },
              },
              '&:hover fieldset': { borderColor: 'white' },
            }}
          />
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : filteredEntries.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
            <Typography variant="h6" gutterBottom>No summaries found</Typography>
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
              <Table aria-label="summary table" sx={{ color: 'white' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontFamily:'Poppins' }}>
                      <TableSortLabel
                        active={orderBy === 'title'}
                        direction={orderBy === 'title' ? order : 'asc'}
                        onClick={() => handleSort('title')}
                      >
                        Title
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontFamily:'Poppins' }}>
                      <TableSortLabel
                        active={orderBy === 'source_lang'}
                        direction={orderBy === 'source_lang' ? order : 'asc'}
                        onClick={() => handleSort('source_lang')}
                      >
                        Language
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily:'Poppins' }}>
                      <TableSortLabel
                        active={orderBy === 'date'}
                        direction={orderBy === 'date' ? order : 'asc'}
                        onClick={() => handleSort('date')}
                      >
                        Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily:'Poppins' }}>View Transcripts</TableCell>
                    <TableCell align="right" sx={{ fontFamily:'Poppins' }}>Share</TableCell>
                    <TableCell align="right" sx={{ fontFamily:'Poppins' }}>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedEntries.map((translation) => (
                    <TableRow
                      key={translation.doc_id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                    >
                      <TableCell align="left" sx={{ fontFamily:'Poppins', fontSize: '0.875rem' }}>{translation.title}</TableCell>
                      <TableCell align="right" sx={{ fontFamily:'Poppins', fontSize: '0.875rem' }}>{translation.source_lang}</TableCell>
                      <TableCell align="right" sx={{ fontFamily:'Poppins', fontSize: '0.875rem' }}>{new Date(translation.Date).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="View Transcript">
                          <IconButton onClick={() => handleVisibilityClick(translation.doc_id)}>
                            <VisibilityIcon sx={{ color: 'gray', '&:hover': { color: 'white' } }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Share">
                          <IconButton onClick={() => handleShare(translation.doc_id)}>
                            <ShareIcon sx={{ color: 'blue', '&:hover': { color: 'darkblue' } }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDelete(translation.doc_id)}>
                            <DeleteIcon sx={{ color: 'red', '&:hover': { color: 'darkred' } }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
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
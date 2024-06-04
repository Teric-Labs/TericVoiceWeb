import React, { useState, useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import './Pagination.css';
import ReactPaginate from 'react-paginate';

export default function DataTable() {
  const [filter, setFilter] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [user, setUser] = useState({ username: '', userId: '' });
  const entriesPerPage = 5;
  const navigate = useNavigate();

  const handleVisibilityClick = (id) => {
    console.log(`Visibility icon clicked for Audio ID: ${id}`);
    navigate(`/dashboard/audio/${id}`);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);
  
 
  useEffect(() => {
    const fetchEntries = async () => {
      if (typeof user.userId !== 'string' || !user.userId.startsWith('user_')) {
        console.error('Invalid user ID format');
        setLoading(false);
        return;
      }
      const apiEndpoint = 'http://127.0.0.1:8000/get_audios';
      try {
        console.log("here is the user"+user.userId)
        const response = await axios.post(apiEndpoint, { user_id:"user_229088OPP" });
        setEntries(response.data.entries);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch entries', error);
        setLoading(false);
      }
    };

    fetchEntries();
  }, [user.userId]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const displayedEntries = entries.slice(
    currentPage * entriesPerPage,
    (currentPage + 1) * entriesPerPage
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ padding: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search by Audio Name"
            onChange={(e) => setFilter(e.target.value)}
            sx={{ mb: 2, label: { color: 'gray' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'gray' } } }}
          />
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table aria-label="simple table" sx={{ fontFamily: 'Poppins' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontFamily: 'Poppins' }}>Select</TableCell>
                    <TableCell sx={{ fontFamily: 'Poppins' }}>Audio Name</TableCell>
                    <TableCell align="left" sx={{ fontFamily: 'Poppins' }}>Date</TableCell>
                    <TableCell align="right" sx={{ fontFamily: 'Poppins' }}>View Transcripts</TableCell>
                    <TableCell align="right" sx={{ fontFamily: 'Poppins' }}>Share</TableCell>
                    <TableCell align="right" sx={{ fontFamily: 'Poppins' }}>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedEntries.map((audio) => (
                    <TableRow key={audio.doc_id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                      <TableCell component="th" scope="row">
                        <Checkbox />
                      </TableCell>
                      <TableCell align="left" sx={{ fontFamily: 'Poppins', fontSize: '0.875rem' }}>{audio.title}</TableCell>
                      <TableCell align="right" sx={{ fontFamily: 'Poppins', fontSize: '0.875rem' }}>{audio.Date}</TableCell>
                      <TableCell align="right"><IconButton onClick={() => handleVisibilityClick(audio.doc_id)}><VisibilityIcon sx={{ color: 'gray', '&:hover': { color: 'white' } }} /></IconButton></TableCell>
                      <TableCell align="right"><IconButton><ShareIcon sx={{ color: 'blue', '&:hover': { color: 'darkblue' } }} /></IconButton></TableCell>
                      <TableCell align="right"><IconButton><DeleteIcon sx={{ color: 'red', '&:hover': { color: 'darkred' } }} /></IconButton></TableCell>
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
                pageCount={Math.ceil(entries.length / entriesPerPage)}
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
    </Box>
  );
}

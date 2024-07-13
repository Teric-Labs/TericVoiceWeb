import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, IconButton, TextField, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './Pagination.css';

export default function TextTable() {
  const [filter, setFilter] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [user, setUser] = useState({ username: '', userId: '' });
  const entriesPerPage = 5; 
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    const apiEndpoint = 'https://teric-asr-api-wlivbm2klq-ue.a.run.app/et_tts_audios';
    const fetchEntries = async () => {
      try {
        const response = await axios.post(apiEndpoint, { user_id:user.userId });
        setEntries(response.data.entries);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch entries', error);
      }
    };

    fetchEntries();
  }, []);

  const handleVisibilityClick = (id) => {
    console.log(`Visibility icon clicked for Audio ID: ${id}`);
    navigate(`/dashboard/tts/${id}`);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const filteredEntries = entries.filter((audio) =>
    audio.Translation.toLowerCase().includes(filter.toLowerCase())
  ).map((audio) => ({
    ...audio,
    // Limiting the display length of translation text to 100 characters
    Translation: audio.Translation.length > 100 ? audio.Translation.substring(0, 100) + "..." : audio.Translation
  }));

  const displayedEntries = filteredEntries.slice(
    currentPage * entriesPerPage,
    (currentPage + 1) * entriesPerPage
  );

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        variant="outlined"
        sx={{ fontFamily: 'Poppins', marginBottom: 2 }}
        label="Search by audio Name"
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
                  <TableCell sx={{ fontFamily: 'Poppins' }}>Select</TableCell>
                  <TableCell  sx={{ fontFamily: 'Poppins' }}>Text Title</TableCell>
                  <TableCell sx={{ fontFamily: 'Poppins' }}>Source Language</TableCell>
                  <TableCell sx={{ fontFamily: 'Poppins' }}>Target Language</TableCell>
                  <TableCell align="right" sx={{ fontFamily: 'Poppins' }}>Date</TableCell>
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
                    <TableCell  align="left" sx={{ fontSize: '0.875rem', fontFamily: 'Poppins' }}>{audio.title}</TableCell>
                    <TableCell align="left" sx={{ fontSize: '0.875rem', fontFamily: 'Poppins' }}>{audio.source_language}</TableCell>
                    <TableCell align="left" sx={{ fontSize: '0.875rem', fontFamily: 'Poppins' }}>{audio.target_language}</TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.875rem', fontFamily: 'Poppins' }}>{audio.Date}</TableCell>
                    <TableCell align="right"><IconButton onClick={() => handleVisibilityClick(audio.doc_id)}><VisibilityIcon sx={{ color: 'gray', '&:hover': { color: 'black' } }} /></IconButton></TableCell>
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
    </Box>
  );
}

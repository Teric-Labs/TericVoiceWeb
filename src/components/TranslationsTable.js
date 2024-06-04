import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './Pagination.css';
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

export default function TranslationsTable() {
  const [filter, setFilter] = useState('');
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const entriesPerPage = 5; 
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: '', userId: '' });

  const handleVisibilityClick = (id) => {
    console.log(`Visibility icon clicked for Audio ID: ${id}`);
    navigate(`/dashboard/ttdata/${id}`);
  };
 
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
     
    }
  }, []);
  useEffect(()=>{
    const apiEndpoint = 'http://127.0.0.1:8000/get_translations';
    const fetchEntries  =async()=>{
      if (typeof user.userId !== 'string' || !user.userId.startsWith('user_')) {
        console.error('Invalid user ID format');
        setLoading(false);
        return;
      }
      try{
        const response = await axios.post(apiEndpoint,{user_id:user.userId});
        setEntries(response.data.entries);
        setLoading(false);
        
      } catch(error){
        console.error('Failed to fecth entries',error)
      }
    }

    fetchEntries();
  },[user.userId])

  const filteredEntries = entries.filter((audio) =>
    audio.Original_transcript.toLowerCase().includes(filter.toLowerCase())
  ).map((audio) => ({
    ...audio,
    // Limiting the display length of translation text to 100 characters
    Translation: audio.Original_transcript.length > 100 ? audio.Original_transcript.substring(0, 100) + "..." : audio.Original_transcript
  }));
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const displayedEntries = filteredEntries.slice(
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
            label="Search by Language" 
            onChange={(e) => setFilter(e.target.value)} 
            sx={{ mb: 2, input: { color: 'white' }, label: { color: 'gray' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'gray' } }, '&:hover fieldset': { borderColor: 'white' } }}
          />
        </Box>
        {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
        <TableContainer>
          <Table aria-label="simple table" sx={{ color: 'white' }}>
            <TableHead>
              <TableRow>
                <TableCell  sx={{ fontFamily:'Poppins'}}>Title</TableCell>
                <TableCell sx={{ fontFamily:'Poppins' }}>Source Language</TableCell>
                <TableCell sx={{ fontFamily:'Poppins' }}>Target Languages</TableCell>
                <TableCell align="right" sx={{ fontFamily:'Poppins'}}>Date</TableCell>
                <TableCell align="right" sx={{ fontFamily:'Poppins' }}>View Transcripts</TableCell>
                <TableCell align="right" sx={{ fontFamily:'Poppins' }}>Share</TableCell>
                <TableCell align="right" sx={{ fontFamily:'Poppins'}}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedEntries.map((translation) => (
                <TableRow key={translation.doc_id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                  <TableCell align="left" sx={{ fontFamily:'Poppins', fontSize: '0.875rem' }}>{translation.title}</TableCell>
                  <TableCell align="right" sx={{ fontFamily:'Poppins', fontSize: '0.875rem' }}>{translation.source_lang}</TableCell>
                  <TableCell align="right" sx={{ fontFamily:'Poppins', fontSize: '0.875rem' }}>{translation.Translations && Object.keys(translation.Translations).join(", ")}</TableCell>
                  <TableCell align="right" sx={{ fontFamily:'Poppins', fontSize: '0.875rem' }}>{translation.Date}</TableCell>
                  <TableCell align="right"><IconButton onClick={() => handleVisibilityClick(translation.doc_id)}><VisibilityIcon sx={{ color: 'gray', '&:hover': { color: 'white' } }} /></IconButton></TableCell>
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
      </Paper>
    </Box>
  );
}

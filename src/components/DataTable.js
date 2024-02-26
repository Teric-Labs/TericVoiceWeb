import React, { useState,useEffect } from 'react';
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
  IconButton
} from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function DataTable() {
  const [filter, setFilter] = useState('');
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  const handleVisibilityClick = (id) => {
    console.log(`Visibility icon clicked for Audio ID: ${id}`);
    navigate(`/audio/${id}`);
  };
 
  useEffect(()=>{
    const apiEndpoint = 'http://127.0.0.1:5000/get_audios/';
    const fetchEntries  =async()=>{
      try{
        const response = await axios.post(apiEndpoint,{user_id:"78"});
        setEntries(response.data.entries);
      } catch(error){
        console.error('Failed to fecth entries',error)
      }
    }

    fetchEntries();
  },[])


  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, backgroundColor: 'black' }}>
        <Box sx={{ padding: 2 }}>
          <TextField 
            fullWidth 
            variant="outlined" 
            label="Search by Audio Name" 
            onChange={(e) => setFilter(e.target.value)} 
            sx={{ mb: 2, input: { color: 'white' }, label: { color: 'gray' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'gray' } }, '&:hover fieldset': { borderColor: 'white' } }}
          />
        </Box>
        <TableContainer>
          <Table aria-label="simple table" sx={{ color: 'white' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Select</TableCell>
                <TableCell sx={{ color: 'white' }}>Audio Name</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>Date</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>View Transcripts</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>Share</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((audio) => (
                <TableRow key={audio.doc_id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                  <TableCell component="th" scope="row">
                    <Checkbox sx={{ color: 'white' }} />
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'white', fontSize: '0.875rem' }}>{audio.fileName}</TableCell>
                  <TableCell align="right" sx={{ color: 'white', fontSize: '0.875rem' }}>{audio.doc_id}</TableCell>
                  <TableCell align="right"><IconButton onClick={() => handleVisibilityClick(audio.doc_id)}><VisibilityIcon sx={{ color: 'gray', '&:hover': { color: 'white' } }} /></IconButton></TableCell>
                  <TableCell align="right"><IconButton><ShareIcon sx={{ color: 'blue', '&:hover': { color: 'darkblue' } }} /></IconButton></TableCell>
                  <TableCell align="right"><IconButton><DeleteIcon sx={{ color: 'red', '&:hover': { color: 'darkred' } }} /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

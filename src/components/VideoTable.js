import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AudioData from '../constants/AudioData';

export default function VideoTable() {
  const [filter, setFilter] = useState('');

  const filteredData = AudioData.filter(audio => audio.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, backgroundColor: 'black', color: 'white', p: 2 }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Videos Transcribed</Typography>
        <TextField 
          fullWidth 
          variant="outlined" 
          label="Search by Video Link" 
          onChange={(e) => setFilter(e.target.value)} 
          sx={{ mb: 2, input: { color: 'white' }, label: { color: 'gray' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'gray' } }, '&:hover fieldset': { borderColor: 'white' } }}
        />
        <TableContainer>
          <Table aria-label="transcribed videos">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Select</TableCell>
                <TableCell sx={{ color: 'white' }}>Video Link</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>Date</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>View Transcripts</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>Share</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((audio) => (
                <TableRow key={audio.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                  <TableCell component="th" scope="row">
                    <Checkbox sx={{ color: 'white' }} />
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'white', fontSize: '0.875rem' }}>{audio.name}</TableCell>
                  <TableCell align="right" sx={{ color: 'white', fontSize: '0.875rem' }}>{audio.date}</TableCell>
                  <TableCell align="right"><IconButton><VisibilityIcon sx={{ color: 'gray', '&:hover': { color: 'white' } }} /></IconButton></TableCell>
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

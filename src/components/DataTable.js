import React ,{useEffect,useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AudioData from '../constants/AudioData'
import Checkbox from '@mui/material/Checkbox'
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share'; 
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import VisibilityIcon from '@mui/icons-material/Visibility'; 


export default function DataTable() {
  return (
    <Box sx={{ width: '82%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
      <Typography sx={{padding:2}}>Audio Transcribed</Typography>
      <TableContainer sx={{ width: '100%', mb: 2}}>
            <Table aria-label="">s
                <TableHead>
                    <TableRow>
                        <TableCell>Select</TableCell>
                        <TableCell>Audio Name</TableCell>
                        <TableCell align="right">Date</TableCell>
                        <TableCell align="right">View Transcripts</TableCell>
                        <TableCell align="right">Share</TableCell>
                        <TableCell align="right">Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                  {AudioData.map((audio)=>(
                    <TableRow key={audio.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{audio.name}</TableCell>
                    <TableCell align="right">{audio.date}</TableCell>
                    <TableCell align="right"><VisibilityIcon sx={{ color: 'gray' }} /></TableCell>
                    <TableCell align="right"><ShareIcon sx={{ color: 'blue' }} /></TableCell>
                    <TableCell align="right"><DeleteIcon sx={{ color: 'red' }} /></TableCell>
                  </TableRow>
                  ))}
                </TableBody>
            </Table>
        </TableContainer>
      </Paper>
      
    </Box>
  );
}

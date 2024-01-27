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


export default function VideoTable() {


  return (
    <Box sx={{ width: '82%' }}>
      <Paper sx={{ width: '100%', mb: 2,p:2,backgroundColor: '#EBDFD7' }}>
      <Typography>Videos Transcribed</Typography>
      <TableContainer sx={{ width: '100%', mb: 2, backgroundColor: '#EBDFD7' }}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Video Link</TableCell>
                        <TableCell align="right">Download</TableCell>
                        <TableCell align="right">Share</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                </TableBody>
            </Table>
        </TableContainer>
      </Paper>
      
    </Box>
  );
}

import React from "react";
import { Box, Typography, Grid, Divider, MenuItem, Select, IconButton, Table, TableBody, TableCell, TableContainer, TableRow, Paper, useTheme } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import GetAppIcon from '@mui/icons-material/GetApp';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
import Transcript from '../constants/Transcript';
import AudioPlayerComponent from "./AudioPlayerComponent";

const audioSource = "https://www.example.com/track1.mp3";

const ViewAudioComponent = () => {
  const theme = useTheme();

  return (
    <Paper elevation={4} sx={{marginTop:'20px', marginX:'20px'}}>
    <Box p={4} sx={{ maxWidth: '1200px', margin: 'auto' }}>
      <Grid container spacing={3} alignItems="center" sx={{color:"white"}}>
        <Grid item xs={12} md={6} >
          <Typography variant="h5" color="textPrimary" >The Art of a Word</Typography>
          <Typography variant="subtitle1" color="textSecondary" >27/01/2024 15:54</Typography>
        </Grid>
        <Grid item xs={12} md={3} sx={{color:"white"}}>
          <Select
            value="select langauge"
            onChange={() => {}}
            fullWidth
            sx={{ '.MuiSelect-select': { color:"white" },borderBlockColor:"white" }}
            IconComponent={ArrowDropDownIcon} 
          >
            <MenuItem value="english">English</MenuItem>
            <MenuItem value="luganda">Luganda</MenuItem>
            <MenuItem value="runyakore">Runyakore</MenuItem>
            <MenuItem value="ateso">Ateso</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} md={3} container justifyContent="flex-end">
          <IconButton sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' }, color: 'white', borderRadius: '50%' }} aria-label="Download">
            <GetAppIcon />
          </IconButton>
          <IconButton sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' }, color: 'white', borderRadius: '50%', marginLeft: 2 }} aria-label="Share">
            <ShareIcon />
          </IconButton>
          <IconButton sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' }, color: 'white', borderRadius: '50%', marginLeft: 2 }} aria-label="Save">
            <SaveIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Divider sx={{ marginTop: 3, backgroundColor: theme.palette.divider }} />
      <TableContainer component={Paper} sx={{ marginTop: 3, backgroundColor: theme.palette.background.paper }}>
        <Table>
          <TableBody>
            {Transcript.map((row, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ color: theme.palette.text.primary }}>{row.time}</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary }}>{row.text}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box id="audiobox" mt={3}>
        <AudioPlayerComponent audioSrc={audioSource}/>
      </Box>
    </Box>
    </Paper>
  );
}

export default ViewAudioComponent;

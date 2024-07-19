import React, { useState } from "react";
import {
  Box, Typography, Accordion, AccordionSummary,
  AccordionDetails, useTheme, Card, CardContent,
  Grid, Button, Modal
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VideoCard from "./VideoCard";
import VideoTable from "./VideoTable";
import YouTube from "../assets/youtube.png";

const VideoStreamComponent = () => {
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useTheme();

  const handleToggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box p={2} sx={{ margin: 'auto', maxWidth: '1200px' }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2, marginBottom: '20px', position: 'relative' }}>
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography sx={{ fontSize: 14, fontFamily: 'Poppins' }} color="text.secondary" gutterBottom>
                Video Transcription Overview
              </Typography>
            </Grid>
            <Grid item>
              <Button
                onClick={handleOpenModal}
                variant="contained"
                color="primary"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <img src={YouTube} style={{ width: 20, height: 20 }} alt="Transcribe Video" />
                Transcribe Video
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box p={3}>
        <Accordion sx={{ boxShadow: theme.shadows[2], '&:before': { display: 'none' }, mb: 3 }} expanded={isTableVisible} onChange={handleToggleTableVisibility}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: theme.palette.action.hover }}>
            <Typography variant="h6" sx={{ fontFamily: 'Poppins' }}>View Transcribed Videos</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ width: '100%', padding: 2, margin: 'auto', justifyContent: 'center', display: 'flex' }}>
            {isTableVisible && <VideoTable />}
          </AccordionDetails>
        </Accordion>
      </Box>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="video-card-modal-title"
        aria-describedby="video-card-modal-description"
      >
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '70%', md: '60%', lg: '50%' },
          bgcolor: 'background.paper', boxShadow: 24, p: { xs: 2, sm: 4, md: 6 },
          borderRadius: 2,
        }}>
          <VideoCard />
        </Box>
      </Modal>
    </Box>
  );
}

export default VideoStreamComponent;

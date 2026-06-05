import React from "react";
import { Box } from "@mui/material";
import { useParams } from 'react-router-dom';
import ViewVoiceoverComponent from "../components/ViewVoiceoverComponent";

const ViewVoiceover = () => {
  const { id } = useParams();
  return (
    <Box>
      <ViewVoiceoverComponent voiceoverId={id} />
    </Box>
  );
};

export default ViewVoiceover;

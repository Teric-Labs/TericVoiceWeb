import React from "react";
import { Box } from "@mui/material";
import { useParams } from 'react-router-dom';
import ViewDubbingComponent from "../components/ViewDubbingComponent";

const ViewDubbing = () => {
  const { id } = useParams();
  return (
    <Box>
      <ViewDubbingComponent dubbingId={id} />
    </Box>
  );
};

export default ViewDubbing;

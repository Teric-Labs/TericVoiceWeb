import React from "react";
import { Box, Card, CardContent, TextField, Button} from "@mui/material";

const VideoCard = () => {
  return (
    <Card sx={{
        width: '80%',
        maxWidth:'100%', 
        margin: 'auto',
        padding:2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#EBDFD7',
      }}>
      <CardContent>
        <form>
          <Box display="flex" alignItems="center">
            <TextField label="Enter Youtube video link" variant="outlined" margin="dense"  sx={{width:'100%'}}/>
            <Button type="submit" variant="contained" color="primary" sx={{ marginLeft: 2 }}>
              Transcribe
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default VideoCard;

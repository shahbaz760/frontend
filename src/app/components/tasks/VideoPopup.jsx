import React from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";

const VideoPopup = ({ isOpen, setIsOpen, heading, media }) => {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <DialogTitle>{heading}</DialogTitle>
      <DialogContent>
        <p>
          You need to grant access to your {media === "video" ? "camera" : ""} 
          to use this feature. Please enable it in your browser settings.
        </p>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsOpen(false)}
        >
          OK
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPopup;

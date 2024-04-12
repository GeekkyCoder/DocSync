import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

function RoomModal({ formData, setFormData, socket, open, setOpen }) {


  const handleModalClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { value, name } = e.target;

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  };

  const handleJoinRoom = () => {
    socket.emit("join-room", formData);
    handleModalClose();
  };



  return (
    <>
    
      <Modal open={open}>
        <Box sx={style}>
          <Stack sx={{ p: "1em" }} direction={"column"} spacing={2}>
            <Box>
              <InputLabel htmlFor="username">User Name</InputLabel>
              <TextField
                value={formData.username}
                placeholder="user name"
                onChange={handleChange}
                name="username"
                sx={{ width: "100%" }}
                label="user name"
              />
            </Box>

            <Box>
              <InputLabel htmlFor="roomId">Room Name</InputLabel>
              <TextField
                value={formData.roomId}
                placeholder="e.g:my room"
                onChange={handleChange}
                name="roomId"
                sx={{ width: "100%" }}
              />
            </Box>
          </Stack>

          <Button
            onClick={handleJoinRoom}
            variant="contained"
            sx={{ margin: "1em auto", display: "block", width: "300px" }}
          >
            Join Room
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default RoomModal;

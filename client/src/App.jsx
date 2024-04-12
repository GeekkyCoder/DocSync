import { useContext, useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import GroupEditor from "./GroupEditor";
import { Routes, Route } from "react-router-dom";
import Appbar from "./components/AppBar";
import { SocketContext } from "./context/socket-context";

const initialData = {
  username: "",
  roomId: "",
};

const App = () => {
  const { socket } = useContext(SocketContext);
  const [isSnackBarOpen, setIsSnacBarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(initialData);

  const handleSnackBarOpen = () => {
    setIsSnacBarOpen(true);
  };

  const handleSnackBarClose = () => {
    setIsSnacBarOpen(false);
  };

  useEffect(() => {
    socket.on("join-room", (data) => {
      setMessage(`${data?.username} joined the room`);
      handleSnackBarOpen();

      setTimeout(() => {
        handleSnackBarClose();
      }, [10000]);
    });

    return () => socket.off("join-room");
  }, []);


  return (
    <div>
      <Appbar />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={isSnackBarOpen}
        onClose={handleSnackBarClose}
        message={message}
      />
      <Routes>
        <Route
          path="/"
          element={
            <GroupEditor
              socket={socket}
              formData={formData}
              setFormData={setFormData}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;

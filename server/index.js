const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");

const path  = require("path")

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.use(
  cors({
    origin:  "http://localhost:5173",
  })
);

let initialEditorData = {
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            text: "A line of text in a paragraph.",
          },
        ],
      },
    ],
  },
};

const groupData = {};

const mousePositions = {};

io.on("connection", (socket) => {
  socket.on("new_operation", (editorData) => {
    groupData[editorData.roomId] = editorData?.value;
    io.emit(`new-remote-operations-${editorData.roomId}`, editorData);
  });

  socket.on("mousemove", (mouseData) => {
    mousePositions[socket.id] = mouseData;
    io.emit("mousemove", { id: socket.id, position: mouseData });
  });

  socket.on("join-room", (data) => {
    socket.join(data?.roomId);
    io.emit("join-room", data);
  });
});

app.get("/rooms/:id", (req, res) => {
  const { id } = req.params;

  //if data does not exist in group for this groupId,initialze it and send the data later...
  if (!(id in groupData)) {
    groupData[id] = initialEditorData;
  }

  res.send(groupData[id]);
});

server.listen(5173, () => {
  console.log("server running at http://localhost:5173");
});

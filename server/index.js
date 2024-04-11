const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
  },
});

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
  })
);

let value = {
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

io.on("connection", (socket) => {
  socket.on("new_operation", (editorData) => {
    groupData[editorData.groupId] = editorData?.value;
    io.emit(`new-remote-operations-${editorData.groupId}`, editorData);
  });
});

app.get("/groups/:id", (req, res) => {
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

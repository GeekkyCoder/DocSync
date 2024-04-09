const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server,{
  cors:{
    origin:"http://127.0.0.1:5173"
  }
});

io.on("connection", (socket) => {
  socket.on("new_operation",(editorData) => {
     io.emit("new-remote-operations",editorData)
  })
});

server.listen(5173, () => {
  console.log("server running at http://localhost:5173");
});

import React, { createContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

const socket = io("http://127.0.0.1:5173");

function SocketContextProivider({ children }) {
  const value = {
    socket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export { SocketContext, SocketContextProivider };

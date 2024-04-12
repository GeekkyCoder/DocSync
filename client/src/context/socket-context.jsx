import React, { createContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

const socket = io("https://doc-o-rama-p2qj.vercel.app");

function SocketContextProivider({ children }) {
  const value = {
    socket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export { SocketContext, SocketContextProivider };

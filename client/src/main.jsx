import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SocketContextProivider } from "./context/socket-context.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketContextProivider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SocketContextProivider>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GameContextProvider } from "./context/GameContext";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <GameContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GameContextProvider>
  </React.StrictMode>
);

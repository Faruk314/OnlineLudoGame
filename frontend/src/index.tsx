import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GameContextProvider } from "./context/GameContext";
import { BrowserRouter } from "react-router-dom";
import { SoundProvider } from "./context/SoundContext";
import { AuthContextProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SoundProvider>
        <GameContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </GameContextProvider>
      </SoundProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

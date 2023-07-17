import React from "react";
import { Route, Routes } from "react-router-dom";
import Menu from "./pages/Menu";
import SinglePlayer from "./pages/SinglePlayer";
import axios from "axios";
import Login from "./pages/Login";
import Register from "./pages/Register";

axios.defaults.withCredentials = true;

function App() {
  return (
    <div className="font-bold">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/local" element={<SinglePlayer />} />
      </Routes>
    </div>
  );
}

export default App;

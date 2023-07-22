import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Menu from "./pages/Menu";
import SinglePlayer from "./pages/SinglePlayer";
import axios from "axios";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthContext } from "./context/AuthContext";
import Multiplayer from "./pages/Multiplayer";
import { SocketContext } from "./context/SocketContext";
import { GameContext } from "./context/GameContext";

axios.defaults.withCredentials = true;

function App() {
  const navigate = useNavigate();
  const { setIsLoggedIn, isLoggedIn, setLoggedUserInfo } =
    useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const { setGameId, gameId } = useContext(GameContext);

  useEffect(() => {
    const getLoginStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/getLoginStatus"
        );

        setIsLoggedIn(response.data.status);
        setLoggedUserInfo(response.data.userInfo);
      } catch (error) {
        console.log(error);
        setIsLoggedIn(false);
      }
    };

    getLoginStatus();
  }, []);

  useEffect(() => {
    socket?.emit("reconnectToRoom", gameId);
  }, [gameId]);

  useEffect(() => {
    socket?.on("gameStart", (gameId) => {
      navigate("/multiplayer");
    });

    return () => {
      socket?.off("gameStart");
    };
  }, [socket, navigate]);

  console.log(isLoggedIn, "app");

  return (
    <div className="font-bold">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/local" element={<SinglePlayer />} />
        <Route path="/multiplayer" element={<Multiplayer />} />
      </Routes>
    </div>
  );
}

export default App;

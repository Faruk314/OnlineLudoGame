import React, { useContext, useEffect, useState } from "react";
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
import OpponentLeft from "./modals/OpponentLeft";
import Loader from "./components/Loader";
import ProtectedAuthPages from "./protection/ProtectedAuthPages";
import ProtectedRoutes from "./protection/ProtectedRoutes";

axios.defaults.withCredentials = true;

function App() {
  const navigate = useNavigate();
  const { setIsLoggedIn, isLoggedIn, setLoggedUserInfo } =
    useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const { gameId } = useContext(GameContext);
  const [openOpponentLeft, setOpenOpponentLeft] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLoginStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/getLoginStatus"
        );

        setLoading(false);
        setIsLoggedIn(response.data.status);
        setLoggedUserInfo(response.data.userInfo);
      } catch (error) {
        console.log(error);
        setIsLoggedIn(false);
        setLoading(false);
      }
    };

    getLoginStatus();
  }, []);

  useEffect(() => {
    socket?.on("connect", () => {
      if (gameId) {
        socket?.emit("reconnectToRoom", gameId);
      }
    });
  }, [gameId, socket, isLoggedIn]);

  useEffect(() => {
    socket?.on("gameStart", (gameId) => {
      navigate(`/multiplayer/${gameId}`);
    });

    return () => {
      socket?.off("gameStart");
    };
  }, [socket, navigate]);

  useEffect(() => {
    socket?.on("opponentLeft", () => {
      setOpenOpponentLeft(true);
      navigate("/menu");
    });

    return () => {
      socket?.off("opponentLeft");
    };
  }, [socket, navigate]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="font-bold">
      <Routes>
        <Route element={<ProtectedAuthPages />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/menu" element={<Menu />} />
          <Route path="/local/:gameId" element={<SinglePlayer />} />
          <Route path="/multiplayer/:gameId" element={<Multiplayer />} />
        </Route>
      </Routes>

      {openOpponentLeft && (
        <OpponentLeft setOpenOpponentLeft={setOpenOpponentLeft} />
      )}
    </div>
  );
}

export default App;

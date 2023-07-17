import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Menu from "./pages/Menu";
import SinglePlayer from "./pages/SinglePlayer";
import axios from "axios";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthContext } from "./context/AuthContext";

axios.defaults.withCredentials = true;

function App() {
  const { setIsLoggedIn, isLoggedIn, setLoggedUserInfo } =
    useContext(AuthContext);

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

  console.log(isLoggedIn, "app");

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

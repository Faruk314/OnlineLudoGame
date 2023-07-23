import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import menuImage from "../assets/images/menu.png";

const Login = () => {
  const [email, setEmail] = useState("farukspahictz@gmail.com");
  const [password, setPassword] = useState("ispitivac");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn, setLoggedUserInfo } = useContext(AuthContext);

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("All fields must be filled");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/login`,
        {
          email,
          password,
        }
      );

      setIsLoggedIn(true);
      setLoggedUserInfo(response.data.userInfo);
      navigate("/menu");
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log(error);
        console.log(error.response.data.message);
        setMessage(error.response.data.message);
      }
    }
  };

  return (
    <section className="flex flex-col space-y-10 items-center justify-center h-[100vh]">
      <div className="flex flex-col items-center">
        <img src={menuImage} className="w-[7rem]" alt="" />

        <div className="flex items-center">
          <span className="text-2xl">Ludo</span>
          <span className="text-4xl text-red-500">GAME</span>
        </div>
      </div>

      <form
        onSubmit={loginHandler}
        className="flex flex-col p-4 text-gray-500 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md "
      >
        <label className="mt-5 text-red-500">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="p-1 bg-transparent border-b rounded-md shadow-sm focus:outline-none"
        />
        <label className="mt-5 text-red-500">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="p-1 bg-transparent border-b rounded-md shadow-sm focus:outline-none"
        />

        <button className="px-2 py-2 mt-5 font-bold text-white bg-red-500 rounded-md hover:bg-red-600">
          LOGIN
        </button>

        <Link to="/register" className="mt-5 text-center text-gray-400">
          Create an account
        </Link>
      </form>

      {message && <p className="text-red-500">{message}</p>}
    </section>
  );
};

export default Login;

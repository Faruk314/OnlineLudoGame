import axios from "axios";
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [email, setEmail] = useState("farukspahictz@gmail.com");
  const [password, setPassword] = useState("ispitivac");
  const [userName, setUsername] = useState("faruk");
  const [message, setMessage] = useState("");
  const { setIsLoggedIn, setLoggedUserInfo } = useContext(AuthContext);

  const navigate = useNavigate();

  const registerHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || !email || !password) {
      setMessage("All fields must be filled");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/register`,
        {
          userName,
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
        <img src="/images/menu.png" className="w-[7rem]" alt="" />

        <div className="flex items-center">
          <span className="text-2xl">Ludo</span>
          <span className="text-4xl text-red-500">GAME</span>
        </div>
      </div>
      <form
        onSubmit={registerHandler}
        className="flex flex-col p-4 text-gray-500 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md "
      >
        <label className="text-red-500">Username</label>
        <input
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
          className="p-1 bg-transparent border-b rounded-sm shadow-sm focus:outline-none"
        />
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

        <button
          type="submit"
          className="px-2 py-2 mt-5 font-bold text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          REGISTER
        </button>

        <Link to="/" className="mt-5 text-center text-gray-400">
          already have an account?
        </Link>
      </form>

      {message && <p className="text-red-500">{message}</p>}
    </section>
  );
};

export default Register;

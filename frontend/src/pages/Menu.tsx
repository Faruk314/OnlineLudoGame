import React, { useContext, useState } from "react";
import { MdPersonSearch } from "react-icons/md";
import { BsPeopleFill } from "react-icons/bs";
import { MdLeaderboard } from "react-icons/md";
import { ImExit } from "react-icons/im";
import Local from "../modals/Local";
import { SoundContext } from "../context/SoundContext";
import { clickSound } from "../constants/constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FindMatch from "../modals/FindMatch";
import Leaderboard from "../modals/Leaderboard";
import { AuthContext } from "../context/AuthContext";
import { BiImageAdd } from "react-icons/bi";
import ChangePhoto from "../modals/ChangePhoto";
import menuImage from "../assets/images/menu.png";
import SoundButton from "../components/SoundButton";
import { SocketContext } from "../context/SocketContext";
const defaultImage = require("../assets/images/default.png");
const custom = require("../assets/images/custom.png");
const custom1 = require("../assets/images/custom1.png");
const custom2 = require("../assets/images/custom2.png");
const custom3 = require("../assets/images/custom3.png");
const custom4 = require("../assets/images/custom4.png");
const custom5 = require("../assets/images/custom5.png");

const Menu = () => {
  const avatars = [custom, custom1, custom2, custom3, custom4, custom5];
  const [openChangePhoto, setOpenChangePhoto] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const [openFindMatch, setOpenFindMatch] = useState(false);
  const [openLocal, setOpenLocal] = useState(false);
  const [openLeaderboard, setOpenLeaderboard] = useState(false);
  const { playSound } = useContext(SoundContext);
  const { loggedUserInfo, setIsLoggedIn } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const logoutHandler = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout");

      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="h-[100vh]">
      <div className="fixed flex justify-between w-full p-2">
        <div
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="relative flex flex-col space-y-2"
        >
          <img
            src={avatars[loggedUserInfo?.image!] || defaultImage}
            alt=""
            className="w-20 h-20 p-1 border border-black rounded-md"
          />

          <div className="flex items-center justify-center font-bold text-white bg-red-500 border border-black rounded-md">
            <span>{loggedUserInfo?.userName}</span>
          </div>

          <span>playerID: {loggedUserInfo?.userId}</span>

          {isHovering && (
            <button
              onClick={() => {
                playSound(clickSound);
                setOpenChangePhoto(true);
              }}
              className="absolute top-0 p-1 text-white bg-red-500 border border-black rounded-full hover:bg-red-400 right-[-1rem]"
            >
              <BiImageAdd size={22} />
            </button>
          )}
        </div>
        <SoundButton />
      </div>

      <div className="flex flex-col items-center justify-center h-full space-y-10">
        <div className="flex flex-col items-center">
          <img src={menuImage} className="w-[7rem]" alt="" />
          <div className="flex items-center">
            <span className="text-2xl">Ludo</span>
            <span className="text-4xl text-red-500">GAME</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-5">
          <button
            onClick={() => {
              playSound(clickSound);
              setOpenLocal(true);
            }}
            className="px-5 py-2 text-white hover:bg-red-600 flex flex-col border border-black justify-between items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-red-500 h-[5rem] rounded-lg"
          >
            <BsPeopleFill size={30} />
            Local
          </button>
          <button
            onClick={() => {
              playSound(clickSound);
              socket?.emit("findMatch");
              setOpenFindMatch(true);
            }}
            className="px-5 flex flex-col justify-between hover:bg-gray-100 items-center py-2 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] h-[5rem]"
          >
            <MdPersonSearch size={30} className="text-green-500" />
            Find match
          </button>
          <button
            onClick={() => {
              setOpenLeaderboard(true);
              playSound(clickSound);
            }}
            className="px-5 flex flex-col justify-between hover:bg-gray-100 items-center py-2 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] h-[5rem]"
          >
            <MdLeaderboard size={30} className="text-green-500" />
            Leaderboard
          </button>

          <button
            onClick={() => {
              playSound(clickSound);
              logoutHandler();
            }}
            className="px-5 flex flex-col justify-between hover:bg-gray-100 items-center py-2 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] h-[5rem]"
          >
            <ImExit size={30} className="text-red-500" />
            Exit
          </button>
        </div>
      </div>
      {openLocal && <Local setOpenLocal={setOpenLocal} />}
      {openFindMatch && <FindMatch setOpenFindMatch={setOpenFindMatch} />}
      {openLeaderboard && (
        <Leaderboard setOpenLeaderboard={setOpenLeaderboard} />
      )}
      {openChangePhoto && (
        <ChangePhoto setOpenChangePhoto={setOpenChangePhoto} />
      )}
    </section>
  );
};

export default Menu;

import React, { useContext, useEffect, useState } from "react";
import { FcInvite } from "react-icons/fc";
import { BsPeopleFill } from "react-icons/bs";
import { MdLeaderboard } from "react-icons/md";
import { ImExit } from "react-icons/im";
import { ImVolumeMute, ImVolumeMute2 } from "react-icons/im";
import Local from "../modals/Local";
import { SoundContext } from "../context/SoundContext";
import { clickSound } from "../constants/constants";

const Menu = () => {
  const [openLocal, setOpenLocal] = useState(false);
  const { isSoundEnabled, setIsSoundEnabled, playSound } =
    useContext(SoundContext);

  return (
    <section className="h-[100vh]">
      <div className="flex justify-between p-2">
        <div></div>
        <button
          onClick={() => setIsSoundEnabled((prev) => !prev)}
          className="flex items-center justify-center w-[2rem] h-[2rem] border-2 border-gray-500 bg-red-500 rounded-md"
        >
          {isSoundEnabled && <ImVolumeMute className="w-full text-white" />}
          {!isSoundEnabled && <ImVolumeMute2 className="w-full text-white" />}
        </button>
      </div>

      <div className="flex flex-col items-center justify-center h-full">
        <img src="/images/menu.png" className="w-[7rem]" />
        <div className="flex items-center">
          <span>Ludo</span>
          <span className="text-3xl text-red-500">GAME</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-5">
          <button
            onClick={() => {
              playSound(clickSound);
              setOpenLocal(true);
            }}
            className="px-5 py-2 border-2 border-gray-500 text-white hover:bg-red-600 flex flex-col justify-between items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-red-500 h-[5rem] rounded-lg"
          >
            <BsPeopleFill size={30} />
            Local
          </button>
          <button
            onClick={() => {
              playSound(clickSound);
            }}
            className="px-5 flex flex-col justify-between hover:bg-gray-100 items-center py-2 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] h-[5rem]"
          >
            <FcInvite size={30} />
            Invite
          </button>
          <button
            onClick={() => {
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
            }}
            className="px-5 flex flex-col justify-between hover:bg-gray-100 items-center py-2 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] h-[5rem]"
          >
            <ImExit size={30} className="text-red-500" />
            Exit
          </button>
        </div>
      </div>
      {openLocal && <Local setOpenLocal={setOpenLocal} />}
    </section>
  );
};

export default Menu;

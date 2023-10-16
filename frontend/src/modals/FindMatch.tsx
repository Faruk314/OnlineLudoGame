import React, { useContext, useState } from "react";
import { GameContext } from "../context/GameContext";
import classNames from "classnames";
import { SoundContext } from "../context/SoundContext";
import { onChangeSound } from "../constants/constants";
import { SocketContext } from "../context/SocketContext";

interface Props {
  setOpenFindMatch: React.Dispatch<React.SetStateAction<boolean>>;
}

const FindMatch = ({ setOpenFindMatch }: Props) => {
  const { setChosenPlayers } = useContext(GameContext);
  const { socket } = useContext(SocketContext);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-30 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="relative z-40 flex flex-col items-center justify-center px-[3rem] md:px-0 md:w-[20rem] py-3 mx-2 space-y-4 bg-white rounded-md shadow-xl">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl">Finding match...</h2>
          <div className="loader"></div>

          <button
            onClick={() => {
              socket?.emit("cancelFindMatch");
              setOpenFindMatch(false);
              setChosenPlayers(0);
            }}
            className="px-3 py-1 font-bold text-white bg-red-500 border border-black rounded-lg disabled:bg-gray-400 hover:bg-red-600 disabled:text-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindMatch;

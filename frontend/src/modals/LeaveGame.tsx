import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { useNavigate } from "react-router-dom";

interface Props {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeaveGame = ({ setOpenModal }: Props) => {
  const { deleteGameState } = useContext(GameContext);
  const navigate = useNavigate();

  const leaveGameHandler = async () => {
    try {
      await deleteGameState();
      navigate("/menu");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="absolute right-0 flex flex-col items-center px-3 py-5 mx-2 space-y-2 bg-white border rounded-md top-[3rem]">
      <h2 className="text-center">Are you sure you want to leave the game ?</h2>

      <div className="flex items-center space-x-2">
        <button
          onClick={leaveGameHandler}
          className="px-4 py-1 text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Yes
        </button>

        <button
          onClick={() => {
            setOpenModal(false);
          }}
          className="px-4 py-1 text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          No
        </button>
      </div>
    </div>
  );
};

export default LeaveGame;

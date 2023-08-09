import React from "react";

interface Props {
  setOpenOpponentLeft: React.Dispatch<React.SetStateAction<boolean>>;
}

const OpponentLeft = ({ setOpenOpponentLeft }: Props) => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-30 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="flex flex-col items-center space-y-2 p-6 text-gray-500 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md bg-white">
        <h2>Opponent left. You won!</h2>

        <button
          onClick={() => setOpenOpponentLeft(false)}
          className="px-3 py-2 font-bold text-white bg-red-500 border border-black rounded-lg disabled:bg-gray-400 hover:bg-red-600 disabled:text-gray-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default OpponentLeft;

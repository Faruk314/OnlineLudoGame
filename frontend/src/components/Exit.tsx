import React, { useState } from "react";
import { ImExit } from "react-icons/im";
import LeaveGame from "../modals/LeaveGame";

const Exit = () => {
  const [openLeaveModal, setOpenLeaveModal] = useState(false);

  return (
    <div className="">
      <button
        onClick={() => setOpenLeaveModal(true)}
        className="w-[2rem] h-[2rem] bg-red-500 hover:bg-red-600 border border-black flex justify-center items-center text-white rounded-md"
      >
        <ImExit />
      </button>

      {openLeaveModal && <LeaveGame setOpenModal={setOpenLeaveModal} />}
    </div>
  );
};

export default Exit;

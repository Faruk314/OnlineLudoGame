import React, { useContext } from "react";
import { ImVolumeMute, ImVolumeMute2 } from "react-icons/im";
import { SoundContext } from "../context/SoundContext";

const SoundButton = () => {
  const { isSoundEnabled, setIsSoundEnabled } = useContext(SoundContext);

  return (
    <button
      onClick={() => setIsSoundEnabled((prev) => !prev)}
      className="flex items-center justify-center w-[2rem] h-[2rem]  bg-red-500 rounded-md"
    >
      {isSoundEnabled && <ImVolumeMute className="w-full text-white" />}
      {!isSoundEnabled && <ImVolumeMute2 className="w-full text-white" />}
    </button>
  );
};

export default SoundButton;

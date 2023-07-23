import axios from "axios";
import classNames from "classnames";
import React, { useContext, useState } from "react";
import custom from "../assets/images/custom.png";
import custom1 from "../assets/images/custom1.png";
import custom2 from "../assets/images/custom2.png";
import custom3 from "../assets/images/custom3.png";
import custom4 from "../assets/images/custom4.png";
import custom5 from "../assets/images/custom.png";
import { AuthContext } from "../context/AuthContext";

interface Props {
  setOpenChangePhoto: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChangePhoto = ({ setOpenChangePhoto }: Props) => {
  const { setLoggedUserInfo } = useContext(AuthContext);
  const [chosenPhoto, setChosenPhoto] = useState<number | null>(null);
  const avatars = [custom, custom1, custom2, custom3, custom4, custom5];

  const updateAvatar = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/changeAvatar", {
        avatar: chosenPhoto,
      });

      setLoggedUserInfo((prev: any) => ({
        ...prev,
        image: chosenPhoto,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-30 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="relative z-40 flex flex-col items-center justify-center px-[3rem] py-3 mx-2 space-y-4 bg-white rounded-md shadow-xl">
        <button
          onClick={() => {
            setOpenChangePhoto(false);
            setChosenPhoto(0);
          }}
          className="flex absolute top-2 right-2 items-center border border-black hover:bg-red-600 justify-center w-[2rem] h-[2rem]  text-white bg-red-500 rounded-md"
        >
          X
        </button>

        <h2>Choose your avatar</h2>

        <div className="grid grid-cols-2 gap-5 p-4 md:grid-cols-3">
          {avatars.map((avatar, index) => (
            <button
              onClick={() => setChosenPhoto(index)}
              className={classNames(
                "flex items-center justify-center w-20 h-20 p-2 border border-black rounded-md",
                {
                  "border-2 border-red-500": chosenPhoto === index,
                }
              )}
              key={index}
            >
              <img src={avatar} alt="" />
            </button>
          ))}
        </div>

        <button
          disabled={chosenPhoto === null ? true : false}
          onClick={updateAvatar}
          className="px-3 py-2 font-bold text-white bg-red-500 border border-black rounded-lg disabled:bg-gray-400 hover:bg-red-600 disabled:text-gray-200"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ChangePhoto;

import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import classNames from "classnames";
import GameOver from "../modals/GameOver";
import Board from "./Board";
import { SocketContext } from "../context/SocketContext";
import { GameState } from "../types/types";
import custom from "../assets/images/custom.png";
import custom1 from "../assets/images/custom1.png";
import custom2 from "../assets/images/custom2.png";
import custom3 from "../assets/images/custom3.png";
import custom4 from "../assets/images/custom4.png";
import custom5 from "../assets/images/custom.png";
import SoundButton from "../components/SoundButton";
import Exit from "../components/Exit";
import Dice from "../components/Dice";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";

const Multiplayer = () => {
  const { players, retrieveGameState, updateGameState } =
    useContext(GameContext);
  const { socket } = useContext(SocketContext);
  const [isLoading, setIsLoading] = useState(true);
  const avatars = [custom, custom1, custom2, custom3, custom4, custom5];
  const { gameId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGameData = async () => {
      const gameDataFetched = await retrieveGameState(gameId!);

      if (!gameDataFetched) {
        navigate("/menu");
      }

      setIsLoading(false);
    };

    if (isLoading && gameId) {
      fetchGameData();
    }
  }, []);

  useEffect(() => {
    if (gameId) socket?.emit("reconnectToRoom", gameId);

    return () => {
      if (gameId) socket?.emit("leaveRoom");
    };
  }, [gameId]);

  useEffect(() => {
    socket?.on("diceRolled", (gameState: GameState) => {
      updateGameState(gameState);
    });

    return () => {
      socket?.off("diceRolled");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("playerMoved", (gameState: GameState) => {
      updateGameState(gameState);

      if (gameState.isGameOver) {
        navigate("/menu");
      }
    });

    return () => {
      socket?.off("playerMoved");
    };
  }, [socket, navigate]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="flex items-center justify-center h-[100vh] z-20">
      <div className="fixed top-0 flex justify-between w-full p-2">
        <div></div>

        <div className="flex items-center space-x-2">
          <SoundButton />
          <Exit />
        </div>
      </div>

      <div className="relative flex justify-center items-center h-[700px]">
        {players.map((player, index) => (
          <div
            key={player.color}
            className={classNames("flex flex-col items-center", {
              "absolute top-0 md:top-[-3rem] lg:top-[-3rem] left-0":
                player.color === "red",
              "absolute top-0 md:top-[-3rem] lg:top-[-3rem] right-0":
                player.color === "green",
              "absolute bottom-0 md:bottom-[-3rem] lg:bottom-[-3rem] left-0":
                player.color === "blue",
              "absolute bottom-0 md:bottom-[-3rem] lg:bottom-[-3rem] right-0":
                player.color === "yellow",
            })}
          >
            <div className="flex items-center h-20 space-x-4 rounded-md">
              <div className="flex flex-col items-center">
                <div className="border-2 border-black rounded-md">
                  <img
                    src={avatars[player.image!]}
                    alt=""
                    className="h-[5rem] p-1"
                  />
                </div>

                <span className="">{player.userName}</span>
              </div>

              <Dice index={index} />
            </div>

            {/* {players[currentPlayerTurnIndex!].userId ===
              loggedUserInfo?.userId &&
              currentPlayerTurnIndex === index && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      playSound(diceRoll);
                      handleDiceThrow();
                    }}
                    className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600 disabled:bg-gray-400"
                  >
                    Throw
                  </button>
                </div>
              )} */}
          </div>
        ))}

        <Board />
      </div>
    </section>
  );
};

export default Multiplayer;

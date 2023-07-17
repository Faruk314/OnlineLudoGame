import React, { createContext, useEffect, useState } from "react";
import { Howl } from "howler";

type SoundContextType = {
  isSoundEnabled: boolean;
  setIsSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  playSound: (soundURL: string) => void;
};

export const SoundContext = createContext<SoundContextType>({
  isSoundEnabled: false,
  setIsSoundEnabled: () => {},
  playSound: (soundURL: string) => {},
});

type SoundProviderProps = {
  children: React.ReactNode;
};

export const SoundProvider = ({ children }: SoundProviderProps) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [menuMusic, setMenuMusic] = useState<Howl | null>(null);

  useEffect(() => {
    const menuMusicSound = new Howl({
      src: ["/sounds/music.mp3"],
      loop: true,
    });

    if (isSoundEnabled) {
      menuMusicSound.play();
    }

    setMenuMusic(menuMusicSound);

    return () => {
      menuMusicSound.stop();
    };
  }, [isSoundEnabled]);

  const playSound = (soundURL: string) => {
    if (isSoundEnabled) {
      const sound = new Howl({
        src: [soundURL],
      });
      sound.play();
    }
  };

  return (
    <SoundContext.Provider
      value={{ isSoundEnabled, setIsSoundEnabled, playSound }}
    >
      {children}
    </SoundContext.Provider>
  );
};

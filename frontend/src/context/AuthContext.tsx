import React, { createContext, useState } from "react";

interface AuthContextProps {
  loggedUserInfo: UserInfo | null;
  setLoggedUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UserInfo {
  userId: number;
  userName: string;
  email?: string;
  image: string;
}

export const AuthContext = createContext<AuthContextProps>({
  loggedUserInfo: null,
  setLoggedUserInfo: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export const AuthContextProvider = ({ children }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUserInfo, setLoggedUserInfo] = useState<UserInfo | null>(null);

  console.log("isLoggedIn auth context", isLoggedIn);

  return (
    <AuthContext.Provider
      value={{ loggedUserInfo, setLoggedUserInfo, isLoggedIn, setIsLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedAuthPages = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return !isLoggedIn ? <Outlet /> : <Navigate to="/menu" />;
};

export default ProtectedAuthPages;

import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Logout = () => {
  useEffect(() => {
    localStorage.removeItem('desiredexpenseapp');
  }, []);

  return <Navigate to="/login" />;
};

export default Logout;

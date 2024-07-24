import React, { useEffect,useContext } from "react";
import { Navigate } from "react-router-dom";

const Logout = () => {
  const { state, setState } = useContext(AppContext);

  useEffect(() => {
    localStorage.removeItem('desiredexpenseapp');
  }, []);

  return <Navigate to="/login" />;
};

export default Logout;

import { AppContext } from "components/AppContext";
import React, { useEffect,useContext } from "react";
import { Navigate } from "react-router-dom";

const Logout = () => {
  const { state, setState } = useContext(AppContext);

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      user: response.data,
    }));
  }, []);

  return <Navigate to="/login" />;
};

export default Logout;

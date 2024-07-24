import React, {useContext} from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "components/AppContext";

const Authmiddleware = (props) => {
  const { state, setState } = useContext(AppContext);
  if (state.user=="") {
    return (
      <>
        <Navigate to={{ pathname: "/login" }} />
      </>
    );
  }
  return (<React.Fragment>
    {props.children}
  </React.Fragment>);
};

export default Authmiddleware;

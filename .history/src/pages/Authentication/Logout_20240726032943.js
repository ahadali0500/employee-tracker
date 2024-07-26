import { AppContext } from "components/AppContext";
import React, { useEffect, useContext } from "react";
import { Navigate,useNavigate } from "react-router-dom";

const Logout = () => {
  const { state, setState } = useContext(AppContext);
  const [isLoggedOut, setIsLoggedOut] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await fetch('https://tracker.desired-techs.com/api/company/logout', {
          method: 'GET', // or 'GET' depending on the API method
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.user.token}`, // if you need to send a token or any authorization header
          },
        });

        if (response.ok) {
          setState(prevState => ({
            ...prevState,
            user: null,
          }));
          setIsLoggedOut(true);
          navigate("/dashboard");
        } else {
          console.error('Logout failed on the server');
          // Handle logout failure if needed
        }
      } catch (error) {
        console.error('Error during logout:', error);
        // Handle error if needed
      }
    };

    logout();
  }, [setState, state.token]);

  if (isLoggedOut) {
    return <Navigate to="/login" />;
  }

  return <div>Logging out...</div>;
};

export default Logout;


import { AppContext } from "components/AppContext";
import React, { useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Navigate,useNavigate } from "react-router-dom";

const Logout = () => {
  const { state, setState } = useContext(AppContext);
  const [isLoggedOut, setIsLoggedOut] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      const logoutPromise = fetch('https://tracker.desired-techs.com/api/company/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.user.token}`, // Use appropriate token if needed
        },
      });

      toast.promise(
        logoutPromise,
        {
          loading: 'Logging out...',
          success: 'Logged out successfully!',
          error: 'Logout failed. Please try again.',
        }
      );

      try {
        const response = await logoutPromise;

        if (response.ok) {
          setState(prevState => ({
            ...prevState,
            user: null,
          }));
          setIsLoggedOut(true);
        } else {
          console.error('Logout failed on the server');
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    logout();
  }, [setState, state.user.token]);

  if (isLoggedOut) {
    return <Navigate to="/login" />;
  }

  return <div>Logging out...</div>;
};

export default Logout;

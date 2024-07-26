import { AppContext } from "components/AppContext";
import React, { useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const Logout = () => {
  const { state, setState } = useContext(AppContext);
  const [isLoggedOut, setIsLoggedOut] = React.useState(false);

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
  }, [setState, state]);

  if (isLoggedOut) {
    return <Navigate to="/login" />;
  }

  // return <div>Logging out...</div>;
};

export default Logout;

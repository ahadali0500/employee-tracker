import React, { createContext, useState, useEffect } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const AttendanceAppDesired = JSON.parse(localStorage.getItem('AttendanceAppDesired'));
  const [state, setState] = useState({
    user: AttendanceAppDesired,
  });
  useEffect(() => {
    localStorage.setItem('AttendanceAppDesired', JSON.stringify(state.user));
  }, [state]);
  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };

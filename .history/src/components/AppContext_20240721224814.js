import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const AttendanceAppDesired = JSON.parse(localStorage.getItem('AttendanceAppDesired'));
  const [state, setState] = useState({
    user: AttendanceAppDesired,
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };

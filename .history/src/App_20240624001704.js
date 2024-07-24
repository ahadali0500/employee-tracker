import React from "react";

import { Routes, Route } from "react-router-dom";
// Import Routes all
import { authProtectedRoutes, publicRoutes } from "./routes";

// Import all middleware
import Authmiddleware from "./routes/route";

// layouts Format
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./assets/scss/theme.scss";
import Layout from 'components/Layout';
import toast, { Toaster } from 'react-hot-toast';








const App = () => {


  return (
    <React.Fragment>
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <NonAuthLayout>
                {route.component}
              </NonAuthLayout>
            }
            key={idx}
            exact={true}
          />
        ))}

        {authProtectedRoutes.map((route, idx) => (
            <Route
              path={route.path}  key={idx}
              element={
                <Authmiddleware><Layout>{route.component}</Layout></Authmiddleware>
              }
              exact={true}
            />
        ))}
      </Routes>
      <Toaster />
    </React.Fragment>
  );
};


export default App;
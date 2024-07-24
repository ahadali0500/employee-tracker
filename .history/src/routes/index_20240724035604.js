import React from "react";
import { Navigate } from "react-router-dom";

// Profile
import UserProfile from "../pages/Authentication/user-profile";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import Logout from "../pages/Authentication/Logout";
import RecoverPassword from "../pages/Authentication/RecoverPassword";
import ForgotPassword from "../pages/Authentication/ForgotPassword";
import CompanyRecoverPassword from "../pages/Authentication/CompanyRecoverPassword";



// Dashboard
import Dashboard from "../pages/Dashboard/index";
//user 
import UserIndex from "../pages/User/Index";
import UserUpdate from "../pages/Authentication/user-profile";
import Useraccess from "../pages/User/Update";


// Company location
import Companylocation from "pages/Companylocation/Index";

import ManagersIndex from "pages/Managers/Index";
import ManagerUpdate from "pages/Managers/Update";



import EmployeeIndex from "pages/Employee/Index";




const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },

  { path: "/users", component: <UserIndex /> },
  { path: "/users/update/:id", component: <Useraccess /> },
  { path: "/profile", component: <UserUpdate /> },


  // general-expense
  { path: "/company-location", component: <Companylocation /> },

  { path: "/managers", component: <ManagersIndex /> },
  { path: "/managers/update/:id", component: <ManagerUpdate /> },


  { path: "/employee", component: <EmployeeIndex /> },
  { path: "/employee/update/:id", component: <EmployeeIndex /> },


];

const publicRoutes = [
  { path: "/", component: <Login /> },
  { path: "/login", component: <Login /> },
  { path: "/register", component: <Register /> },
  { path: "/logout", component: <Logout /> },
  { path: "/forgot-password/", component: <ForgotPassword /> },
  { path: "/user/recover-password/:code", component: <RecoverPassword /> },
  { path: "/company/recover-password/:code", component: <CompanyRecoverPassword /> },

];

export { authProtectedRoutes, publicRoutes };

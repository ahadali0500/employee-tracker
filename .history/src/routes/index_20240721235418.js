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


// General Expense
import GeneralExpenseAdd from "pages/GeneralExpense/Add";
import GeneralExpenseIndex from "pages/GeneralExpense/Index";
import GeneralExpenseUpdate from "pages/GeneralExpense/Update";

// Business Expense
import BusinessExpenseAdd from "pages/BusinessExpense/Add";
import BusinessExpenseIndex from "pages/BusinessExpense/Index";
import BusinessExpenseUpdate from "pages/BusinessExpense/Update";

// department
import DepartmentAdd from "pages/Departments/Add";
import DepartmentIndex from "pages/Departments/Index";
import DepartmentUpdate from "pages/Departments/Update";

// DepartmentTools
import DepartmentToolsAdd from "pages/DepartmentsTools/Add";
import DepartmentToolsIndex from "pages/DepartmentsTools/Index";
import DepartmentToolsUpdate from "pages/DepartmentsTools/Update";

// Employee
import EmployeeAdd from "pages/Employee/Add";
import EmployeeIndex from "pages/Employee/Index";
import EmployeeUpdate from "pages/Employee/Update";

// Bank
import BankAdd from "pages/Bank/Add";
import BankIndex from "pages/Bank/Index";
import BankUpdate from "pages/Bank/Update";

// EverdayExpenses
import EverdayExpensesAdd from "pages/EverdayExpenses/Add";
import EverdayExpensesIndex from "pages/EverdayExpenses/Index";
import EverdayExpensesUpdate from "pages/EverdayExpenses/Update";


const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },

  { path: "/users", component: <UserIndex /> },
  { path: "/users/update/:id", component: <Useraccess /> },
  { path: "/profile", component: <UserUpdate /> },


  // general-expense
  { path: "/company-location/", component: <GeneralExpenseAdd /> },
  { path: "/general-expense/", component: <GeneralExpenseIndex /> },
  { path: "/general-expense/update/:id", component: <GeneralExpenseUpdate /> },

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

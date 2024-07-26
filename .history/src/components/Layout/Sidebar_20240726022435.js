import React from "react";
import withRouter from "components/Common/withRouter";
import SidebarContent from "./SidebarContent";

import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import logoLightPng from "../../assets/images/logo-light.png";
import logoLightSvg from "../../assets/images/logo-light.svg";
import logoDark from "../../assets/images/logo-dark.png";

const Sidebar = props => {

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box">
          <Link to="/dashboard" className="logo logo-dark">
            {/* <span className="logo-sm">
              <img src={logo} alt="" height="22" />
            </span> 
          </Link>
           <Link to="/" className="logo logo-light">
            <span className="logo-sm">
            <img src="/logo/logo2white.png"  width="35px" alt=""  />
            </span>
            <span className="logo-lg">
              <img src="/logo/updatedwhitelogo.png" width="100px"  alt=""  />
            </span>  */}

          </Link>
          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src="/logo/activity-tracker-2.png" width="35px" alt="" />
            </span>
            <span className="logo-lg">
              <img src="/logo/activity-tracker-2.png" width="50px" alt="" /><span style={{ color: 'white', position: 'relative', top: '2px', left: '9px', fontSize: '15px' }} >Employee Tracker</span>
            </span>
          </Link>

        </div>
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};


export default Sidebar;

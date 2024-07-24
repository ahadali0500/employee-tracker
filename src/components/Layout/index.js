import React from "react";

// Layout Related Components
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = props => {
  const { children } = props;

  return (
    <React.Fragment>
      <div id="layout-wrapper">
        <Header />
        <Sidebar />
        <div className="main-content">{children}</div>
        <Footer />
      </div>
    </React.Fragment>
  );
};



export default Layout;

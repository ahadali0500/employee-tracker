import React from "react";
import ReactDOM from 'react-dom/client';
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "components/AppContext";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

  <AppProvider>
    <React.Fragment>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.Fragment>
  </AppProvider>,

);

serviceWorker.unregister();
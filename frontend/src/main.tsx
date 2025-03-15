import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faList,
  faInfoCircle,
  faSignInAlt,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

import "./index.css";
import App from "./App";

library.add(faHome, faList, faInfoCircle, faSignInAlt, faUserPlus);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

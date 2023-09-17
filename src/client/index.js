import React from "react";

import Routes from "./routes";
import { BrowserRouter } from 'react-router-dom';
import { hydrateRoot } from "react-dom/client";

const hydrate = () => {
  const el = document.getElementById("root");
  hydrateRoot(
    el,
    <React.StrictMode>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </React.StrictMode>
  );
};

if (!window._HYDRATE) {
  // <script>window._HYDRATE();</script>
  window._HYDRATE = hydrate;
} else {
  // if shell loaded faster than script
  // window._HYDRATE = true = <script>window._HYDRATE = true</script>
  hydrate();
}

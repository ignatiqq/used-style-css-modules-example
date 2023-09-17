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
  // это означает что скрипт загрузился быстрее
  // потомучто скрипт пришел, а сервер еще не установил window._HYDRATE
  // значит в этом случае бутстрап скрипт пришел вызов фнукции = <script>window._HYDRATE();</script>
  // @ts-ignore
  window._HYDRATE = hydrate;
} else {
  // if shell loaded faster than script
  // это означает что сервер уже установил window._HYDRATE = true = <script>window._HYDRATE = true</script>
  hydrate();
}

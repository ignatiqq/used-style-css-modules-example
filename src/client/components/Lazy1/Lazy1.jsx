import React from "react";
import Shared from "../shared/Shared";

import s from "./Lazy1.module.css";

const Lazy1 = () => {
  return (
    <>
        <h2 className={s.styleThatIDontToLoad}>Lazy 1</h2>
        <Shared />
    </>
  );
};

export default Lazy1;

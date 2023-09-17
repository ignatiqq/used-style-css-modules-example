import React from "react";
import Shared from "../shared/Shared";

import s from "./Lazy2.module.css";

const Lazy2 = () => {
  return (
    <>
        <h2 className={s.styleThatIDontToLoad2}>Lazy 1</h2>
        <Shared />
    </>
  );
};

export default Lazy2;

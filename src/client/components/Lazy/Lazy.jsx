import React from "react";
import Shared from "../shared/Shared";

import s from "./Lazy.module.css";

const Lazy = () => {
  console.log({s, title: s.title});
  return (
    <>
      <h2 className={s.title}>Lazy</h2>
      <Shared />
    </>
  )
};

export default Lazy;

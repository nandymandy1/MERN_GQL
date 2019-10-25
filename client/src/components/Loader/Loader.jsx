import "./Loader.css";
import React from "react";

const Loader = () => (
  <div className="spinner">
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

export default Loader;

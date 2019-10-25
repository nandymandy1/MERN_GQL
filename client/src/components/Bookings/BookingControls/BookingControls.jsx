import React from "react";
import "./BookingControls.css";

const BookingControls = props => {
  return (
    <div className="bookings__controls">
      <button
        className={props.activeOutputType === "list" ? "active" : ""}
        onClick={props.onChange.bind(this, "list")}
      >
        List
      </button>
      <button
        className={props.activeOutputType === "chart" ? "active" : ""}
        onClick={props.onChange.bind(this, "chart")}
      >
        Chart
      </button>
    </div>
  );
};

export default BookingControls;

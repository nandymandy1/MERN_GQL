import React from "react";
import "./BookingList.css";

const BookingList = props => (
  <ul className="booking__list">
    {props.bookings.map(booking => {
      return (
        <li className="booking__item" key={booking._id}>
          <div className="booking__item-data">
            {booking.event.title} -{" "}
            {new Date(booking.createdAt).toLocaleDateString("de-DE")}
          </div>
          <div className="booking__item-action">
            <button
              className="btn"
              onClick={props.onDelete.bind(this, booking._id)}
            >
              Cancel
            </button>
          </div>
        </li>
      );
    })}
  </ul>
);

export default BookingList;

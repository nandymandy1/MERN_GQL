import "./EventItem.css";
import React from "react";

const EventItem = props => (
  <li key={props._id} className="event__list-item">
    <div>
      <h1>{props.title}</h1>
      <h2>
        ${props.price} - {new Date(props.date).toLocaleDateString("de-DE")}
      </h2>
    </div>
    <div>
      {props.userId === props.hostId ? (
        <p>You are the owner of this event.</p>
      ) : (
        <React.Fragment>
          <button
            className="btn"
            onClick={props.onDetail.bind(this, props.eventId)}
          >
            View Details
          </button>
          {/* <span className="tool" data-tip="View the event details.">slot here </span>*/}
        </React.Fragment>
      )}
    </div>
  </li>
);

export default EventItem;

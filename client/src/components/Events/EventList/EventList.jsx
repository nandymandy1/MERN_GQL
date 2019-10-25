import "./EventList.css";
import React from "react";
import EventItem from "./EventItem/EventItem";

const EventList = props => {
  const events = props.events.map(event => (
    <EventItem
      key={event._id}
      eventId={event._id}
      title={event.title}
      price={event.price}
      date={event.date}
      hostId={event.host._id}
      userId={props.authUser}
      onDetail={props.onViewDetail}
    />
  ));
  return <ul className="event__list">{events}</ul>;
};

export default EventList;

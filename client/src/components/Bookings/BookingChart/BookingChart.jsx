import "./BookingChart.jsx";
import React from "react";

const BOOKING_BUCKETS = {
  Cheap: { min: 0, max: 200 },
  Normal: { min: 200, max: 400 },
  Expensive: { min: 400, max: 10000 }
};

const BookingChart = props => {
  let output = {};
  for (const bucket in BOOKING_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (current.event.price < BOOKING_BUCKETS[bucket]) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    output[bucket] = filteredBookingsCount;
  }
  console.log(output);
  return <div></div>;
};

export default BookingChart;

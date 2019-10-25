const AuthResolver = require("./Auth");
const EventResolver = require("./Event");
const BookingResolver = require("./Booking");

const rootResolver = {
  ...AuthResolver,
  ...EventResolver,
  ...BookingResolver
};

module.exports = rootResolver;

const Event = require("../../models/Event");
const Booking = require("../../models/Booking");
const { transformBooking, transformEvent } = require("./functions/merge");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Authentication required");
    }
    try {
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async ({ eventId }, req) => {
    if (!req.isAuth) {
      throw new Error("Authentication required");
    }
    const eventToBeBooked = await Event.findOne({ _id: eventId });
    const booking = new Booking({
      user: req.userId,
      event: eventToBeBooked
    });
    const result = await booking.save();
    return transformBooking(result);
  },

  cancelBooking: async ({ bookingId }, req) => {
    if (!req.isAuth) {
      throw new Error("Authentication required");
    }
    try {
      const booking = await Booking.findById(bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};

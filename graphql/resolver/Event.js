const User = require("../../models/User");
const Event = require("../../models/Event");
const { transformEvent } = require("./functions/merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },

  addEvent: async ({ eventInput }, req) => {
    if (!req.isAuth) {
      throw new Error("Authentication required");
    }
    let { title, description, price, date } = eventInput;
    const event = new Event({
      title: title,
      description: description,
      price: +price,
      date: new Date(date),
      host: req.userId
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const host = await User.findById(req.userId);
      if (!host) {
        throw new Error("User not found.");
      }
      host.createdEvents.push(event);
      await host.save();
      return createdEvent;
    } catch (err) {
      throw err;
    }
  }
};

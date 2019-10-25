const { Schema, model } = require("mongoose");

const EventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = model("Event", EventSchema);

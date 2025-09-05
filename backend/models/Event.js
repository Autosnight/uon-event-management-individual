// backend/models/Event.js
const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    count: { type: Number, required: true, min: 0, default: 0 },
    price: { type: Number, required: true, min: 0, default: 0 },
    attendees: [{ type: String, required: true }]
  },
  { _id: false } // No _id generation for subsection
);

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  description: String,
  tickets: { type: [TicketSchema], default: [], required: true },
  createdBy: { type: String, required: true },
  images: [String], //image url list
});

module.exports = mongoose.model('Event', eventSchema);

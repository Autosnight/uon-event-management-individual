// backend/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  time:{ type: String, required: true },
    venue: { type: String, required: true },
    description: String,
    tickets: [{ type: String, required: true }],

  createdBy: { type: String, required: true },
    attendees: [{ type: String, required: true }]
});

module.exports = mongoose.model('Event', eventSchema);

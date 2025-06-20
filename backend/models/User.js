// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
    role: {
      type: String,
      enum: ['organizer', 'attendee'],
      required: true,
    },
});

module.exports = mongoose.model('User', userSchema);

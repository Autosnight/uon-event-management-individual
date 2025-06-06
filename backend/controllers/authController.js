// backend/controllers/authController.js
const User = require('../models/User');
const Event = require('../models/Event');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() } })
    .sort('date');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch upcoming events' });
  }
};

const getUserRegistrations = async (req, res) => {
  try {
  console.log(1);
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  console.log(user);
    const events = await Event.find({ attendees: user.username }).sort('date');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch organizer events' });
  }
};

const getMyCreatedEvents = async (req, res) => {
  try {
//  console.log(1);
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
//    console.log(user);
    const events = await Event.find({ createdBy: user.username }).sort('date');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch organizer events' });
  }
};

const register = async (req, res) => {
  const { email, username, password,role } = req.body;

  try {
   const existingUser = await User.findOne({ username });
       if (existingUser) {
         return res.status(400).json({ error: 'Username already taken' });
       }
   const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email,username, password: hashed, role });
    res.status(201).json({ message: 'User created' });
  } catch (e) {
    res.status(400).json({error: e.message});
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({
  token,
    username: user.username,
    role: user.role,
  });
};

const dashboard = async (req, res) => {
  res.json({ message: `Welcome user ${req.user.id}` });
};

const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token){
    return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ username: user.username, role: user.role || 'user' });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const createEvent = async (req, res) => {
  const { name, date, time, venue, description, tickets, createdBy } = req.body;
  console.log({ name, date, time, venue, description, tickets, createdBy });

      try {

        const newEvent = await Event.create({
          name,
          date,
          time,
          venue,
          description,
          tickets,
          createdBy,
        });

        res.status(201).json({ message: 'Event created', event: newEvent });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
};


const registerForEvent = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.attendees.includes(user.username)) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    event.attendees.push(user.username);
    await event.save();

    res.json({ message: 'Registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const cancelForEvent = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    await Event.findByIdAndUpdate(
                      req.params.id,
                      { $pull: { attendees: user.username } },
                      { new: true }
                    );

    res.json({ message: 'Cancelled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cancellation failed' });
  }
};

module.exports = {
  register,
  login,
  dashboard,
  getProfile,
  getUpcomingEvents,
  getUserRegistrations,
  getMyCreatedEvents,
  createEvent,
  registerForEvent,
  cancelForEvent
};
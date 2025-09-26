// backend/controllers/authController.js
const User = require('../models/User');
const Event = require('../models/Event');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes, createHash } = require('crypto');
const { sendMail } = require('../utils/mailer');

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
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    console.log(user);
    const events = await Event.find({ "tickets.attendees": user.username }).sort("date");
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendee events' });
  }
};

const getMyCreatedEvents = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    const events = await Event.find({ createdBy: user.username }).sort('date');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch organizer events' });
  }
};

const register = async (req, res) => {
  try {
    const { email, username, password, role } = req.body;
    //1. Check for email address
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      return res.status(400).json({ error: 'Email invalid' });
    }
    //2. Check for existing user
    //TODO: Set a rule for making username (currently no rule)
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const userNameExists = await User.findOne({ username });
    if (userNameExists) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, username, password: hashedPassword, role, isVerified: false });

    // generate verification token
    const rawToken = randomBytes(32).toString('hex');
    newUser.verifyToken = createHash('sha256').update(rawToken).digest('hex');
    newUser.verifyTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await newUser.save();

    const baseApi = process.env.API_URL || 'http://localhost:5000';
    const verifyUrl = `${baseApi}/api/auth/verify-email?token=${rawToken}&id=${newUser._id}`;
    // const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}&id=${newUser._id}`;

    await sendMail({
      to: newUser.email,
      subject: 'Verify your email',
      html: `
        <p>Hi ${newUser.username},</p>
        <p>Please verify your email for your UoN Events account:</p>
        <p><a href="${verifyUrl}">Verify my email</a></p>
        <p>This link will expire in 1 hour.</p>
      `
    });

    return res.status(201).json({ message: 'Verification email sent. Please check your inbox.' });

  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token, id } = req.query; // GET /api/auth/verify-email?token=...&id=...
    if (!token || !id) {
      return res.status(400).json({ error: 'Missing token or id' });
    }

    const hashed = createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      _id: id,
      verifyToken: hashed,
      verifyTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Token invalid or expired' });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();

    // 成功后跳回前端提示
    const redirectTo =
      (process.env.CLIENT_URL || 'http://localhost:5173') + '/verify-result?ok=1';
    return res.redirect(302, redirectTo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
const login = async (req, res) => {
  try {
    const { username: identifier, password } = req.body;
    const id = String(identifier || '').trim();
    const isEmail = /\S+@\S+\.\S+/.test(id);
    if (!id) {
      return res.status(400).json({ error: 'Missing username or email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
    const user = await User.findOne(isEmail ? { email: id } : { username: id }).lean(); //NOTE: lean() to fecth existing 字段 only
    if (!user) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

    const hasIsVerifiedField =
      (user.toObject ? user.toObject() : user).hasOwnProperty('isVerified');
    if (hasIsVerifiedField && user.isVerified === false) {
      return res.status(403).json({ error: 'Please verify your email' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({
      token,
      username: user.username,
      role: user.role,
    });
  } catch (e) {
    res.status(500).json({ error: 'server error' });
  }
};

const dashboard = async (req, res) => {
  res.json({ message: `Welcome user ${req.user.id}` });
};

const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
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
  const { name, date, time, venue, description, createdBy } = req.body;
  let tickets = [];
  try {
    tickets = req.body.tickets ? JSON.parse(req.body.tickets) : [];
  }
  catch {
    tickets = [];
  }
  try {
    const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
    // req.files is provided by multer
    const images = (req.files || []).map(f => `${baseUrl}/uploads/${f.filename}`);
    const newEvent = await Event.create({
      name,
      date,
      time,
      venue,
      description,
      tickets,
      createdBy,
      images
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

    const { type } = req.body;
    if (!type) return res.status(400).json({ error: 'ticket type is required' });

    if (event.tickets.some(ticket => ticket.attendees.includes(user.username))) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    const ticket = event.tickets.find(t => t.type === type);
    if (!ticket) return res.status(400).json({ error: 'Invalid ticket type' });
    if (ticket.count <= 0) return res.status(400).json({ error: 'Sold out for this ticket type' });

    ticket.attendees.push(user.username);
    ticket.count -= 1;
    await event.save(); //NOTE: Must save! Or the changes will not be made to database!

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

    const { type } = req.body;
    const ticket = event.tickets.find(t => t.type === type);
    ticket.count += 1;
    await event.save();
    ticket.attendees = ticket.attendees.filter(a => a !== user.username);
    await event.save();

    res.json({ message: 'Cancelled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Cancellation failed' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    await Event.findByIdAndDelete(eventId);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

const editEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const b = req.body || {};
    const update = {};

    // 基础字段
    if (typeof b.name !== 'undefined') update.name = String(b.name).trim();
    if (typeof b.date !== 'undefined') update.date = b.date;             // 前端已是 yyyy-mm-dd
    if (typeof b.time !== 'undefined') update.time = b.time;
    if (typeof b.venue !== 'undefined') update.venue = String(b.venue).trim();
    if (typeof b.description !== 'undefined') update.description = b.description;

    // 票种：兼容字符串(JSON)/数组
    if (typeof b.tickets !== 'undefined') {
      let tickets = b.tickets;
      if (typeof tickets === 'string') {
        try { tickets = JSON.parse(tickets); } catch { }
      }
      if (!Array.isArray(tickets)) tickets = [];
      update.tickets = tickets;
    }

    const updated = await Event.findByIdAndUpdate(eventId, update, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: 'Event updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event' });
  }
}

const enable2FA = async (req, res) => {
  console.log("enable2FA called");
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    user.is2FAEnabled = true;
    await user.save();
  } catch (error) {
    res.status(500).json({ error: 'Enabling 2FA setting failed...' });
  }
}

const disable2FA = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    user.is2FAEnabled = false;
    await user.save();
  } catch (error) {
    res.status(500).json({ error: 'Disabling 2FA setting failed...' });
  }
}

const get2FAStatus = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (typeof user.is2FAEnabled === 'undefined') {
      console.log("is2FAEnabled field not found, setting to false by default");
      user.is2FAEnabled = false;
      await user.save();
    }
    res.json({ value: !!user.is2FAEnabled });

    console.log("is2FAEnabled: " + !!user.is2FAEnabled);
  } catch (error) {
    res.status(500).json({ error: 'Fetching 2FA setting failed...' });
  }
}

module.exports = {
  register,
  verifyEmail,
  login,
  dashboard,
  getProfile,
  getUpcomingEvents,
  getUserRegistrations,
  getMyCreatedEvents,
  createEvent,
  registerForEvent,
  cancelForEvent,
  deleteEvent,
  editEvent,
  enable2FA,
  disable2FA,
  get2FAStatus
};
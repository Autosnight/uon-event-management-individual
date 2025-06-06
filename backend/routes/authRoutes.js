// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { register,
login,
dashboard,
getProfile,
getUpcomingEvents,
getUserRegistrations,
getMyCreatedEvents,
 createEvent,
 registerForEvent,
 cancelForEvent
 } = require('../controllers/authController');


router.post('/register', register);
router.post('/login', login);
router.get('/dashboard', authMiddleware, dashboard);
router.get('/user/profile', authMiddleware, getProfile);

router.get('/user/registrations', authMiddleware, getUserRegistrations);
router.get('/organizer/my-events', authMiddleware, getMyCreatedEvents);

router.get('/events/upcoming', authMiddleware, getUpcomingEvents);
router.post('/create-event', authMiddleware, createEvent);

router.post('/events/register/:id', authMiddleware, registerForEvent);
router.post('/events/cancel/:id', authMiddleware, cancelForEvent);

module.exports = router;

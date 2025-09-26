// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { register,
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
} = require('../controllers/authController');

// multer config
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });


const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  }
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 } // 5MB/pic，maximum 10 pics
});

router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.get('/dashboard', authMiddleware, dashboard);
router.get('/user/profile', authMiddleware, getProfile);

router.get('/user/registrations', authMiddleware, getUserRegistrations);
router.get('/organizer/my-events', authMiddleware, getMyCreatedEvents);

router.get('/events/upcoming', authMiddleware, getUpcomingEvents);
router.post('/create-event', authMiddleware, upload.array('images', 10), createEvent);

router.post('/events/register/:id', authMiddleware, registerForEvent);
router.post('/events/cancel/:id', authMiddleware, cancelForEvent);

router.delete('/organizer/delete-event/:id', authMiddleware, deleteEvent);
router.put('/organizer/update-event/:id', authMiddleware, editEvent);

router.post('/2fa/enable', authMiddleware, enable2FA);
router.post('/2fa/disable', authMiddleware, disable2FA);
router.get('/2fa/status', authMiddleware, get2FAStatus);

module.exports = router;
// backend/routes/changePwdRoute.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { changePwd } = require('../controllers/changePwdController');

router.put('/change-password', authMiddleware, changePwd);

module.exports = router;
// backend/controllers/changePwdController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const changePwd = async (req, res) => {
    try {
        console.log("Change password request received");

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const { newPassword } = req.body || {};
        if (!newPassword) return res.status(400).json({ error: "New password is required" });

        const sameAsOld = await bcrypt.compare(newPassword, user.password);
        if (sameAsOld) {
            return res.status(400).json({ error: "New password must be different from the old one" });
        }

        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        return res.json({ message: "Password updated successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message || "Server error" });
    }
}

module.exports = {
    changePwd,
};
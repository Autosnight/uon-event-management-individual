// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const app = express();
const path = require('path');

app.use(cors({
  //      origin: 'http://localhost:5173',
  //      credentials: true
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/uploads',  express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = Number(process.env.PORT || 5000);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));

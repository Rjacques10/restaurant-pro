const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

//servir images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')) );

// 🔗 MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/restaurant')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menus', require('./routes/menuRoutes'));

// // 🔥 NOUVEAU PORT
const PORT = 5004;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
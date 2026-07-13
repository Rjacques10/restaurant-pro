require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// servir les images uploadées
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/restaurant')
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.error("Erreur MongoDB:", err.message));

// ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menus', require('./routes/menuRoutes'));

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});

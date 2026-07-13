const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Identifiants manquants" });
  }

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({ message: "Utilisateur introuvable" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, username: admin.username });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const multer = require('multer');
const path = require('path');

// CONFIG UPLOAD
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ADD MENU AVEC IMAGE
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const menu = new Menu({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      image: req.file.filename
    });

    await menu.save();
    res.json(menu);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET
router.get('/', async (req, res) => {
  const menus = await Menu.find();
  res.json(menus);
});

// LIKE
router.post('/:id/like', async (req, res) => {
  const menu = await Menu.findById(req.params.id);
  menu.likes++;
  await menu.save();
  res.json(menu);
});

module.exports = router;
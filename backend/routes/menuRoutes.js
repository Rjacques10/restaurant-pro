const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

// CONFIG UPLOAD
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!allowed.includes(path.extname(file.originalname).toLowerCase())) {
      return cb(new Error('Format d\'image non autorisé'));
    }
    cb(null, true);
  }
});

// GET all menus — public
router.get('/', async (req, res) => {
  try {
    const menus = await Menu.find().sort({ category: 1, name: 1 });
    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD MENU — protected, admin only
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.body.name || !req.body.price || !req.body.category) {
      return res.status(400).json({ error: "Nom, prix et catégorie sont requis" });
    }

    const menu = new Menu({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      image: req.file ? req.file.filename : null
    });

    await menu.save();
    res.status(201).json(menu);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE MENU — protected
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const update = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    };
    if (req.file) update.image = req.file.filename;

    const menu = await Menu.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!menu) return res.status(404).json({ error: "Plat introuvable" });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE MENU — protected
router.delete('/:id', auth, async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) return res.status(404).json({ error: "Plat introuvable" });

    if (menu.image) {
      const imgPath = path.join('uploads', menu.image);
      fs.unlink(imgPath, () => {}); // best effort cleanup, ignore errors
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LIKE — public (customer-facing)
router.post('/:id/like', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ error: "Plat introuvable" });
    menu.likes++;
    await menu.save();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
  likes: { type: Number, default: 0 }
});

module.exports = mongoose.models.Menu || mongoose.model('Menu', MenuSchema);

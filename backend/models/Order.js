const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: Array,
  total: Number,
  location: {
    lat: Number,
    lng: Number
  },
  status: { type: String, default: 'pending' }
});

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
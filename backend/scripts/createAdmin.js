// Usage : node scripts/createAdmin.js <username> <password>
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const [username, password] = process.argv.slice(2);

if (!username || !password) {
  console.error('Usage : node scripts/createAdmin.js <username> <password>');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/restaurant')
  .then(async () => {
    const existing = await Admin.findOne({ username });
    if (existing) {
      console.error(`Le compte "${username}" existe déjà.`);
      process.exit(1);
    }

    await Admin.create({ username, password }); // haché automatiquement par le hook pre('save')
    console.log(`Compte admin "${username}" créé avec succès.`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Erreur de connexion MongoDB :', err.message);
    process.exit(1);
  });

const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userAccessSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
  },
  browser: {
    type: String,
  },
  country: {
    type: String,
  },
});


const UserAccess = mongoose.model('UserAccess', userAccessSchema);

module.exports = UserAccess;

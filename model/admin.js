const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    set: (plainPassword) => {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(plainPassword, salt);
      return hashedPassword;
    },
  },
  profile_image: {
    type: String,
  },
});

adminSchema.methods.verifyPassword = function (plainPassword) {
  return bcrypt.compareSync(plainPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;

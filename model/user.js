const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
  decoded_password: {
    type: String,
  },
  address: {
    address1: {
      type: String,
    },
    address2: {
      type: String,
    },
    landmark: {
      type: String,
    },
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  aadhar_no: {
    type: String,
  },
  age: {
    type: Number,
  },
});

userSchema.methods.verifyPassword = function (plainPassword) {
  return bcrypt.compareSync(plainPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

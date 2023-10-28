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
  profile_image:{
    type:String
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
  licence_no: {
    type: String,
    required:true,
    unique:true,
    default: function () {
      const timestamp = new Date();
      const num = (timestamp % 10000000 + 1000000).toString().substring(0, 7);
      return 'LT' + num;
    },
    set: function (val) {
      return this.isNew ? val : this.licence_no;
    },
  },
  guardian_name:{
    type:String
  },
  guardian_number:{
    type: String
  },
  dob: {
    type: Date,
  },
  age: {
    type: Number,
  },
  phone_no: {
    type: String,
  },
  alternate_phone_no: {
    type: String,
  },
  certificate: {
    type: [String]
  },
  last_job: {
    type: String
  },
  blood_group: {
    type: String
  },
  married_status: {
    type: Boolean
  },
  languages: {
    type: [String]
  },
  education: {
    type: [String]
  },
  status: {
    type: String,
    enum:[ "active" , "inactive"],
    default:"inactive"
  },
});

userSchema.methods.verifyPassword = function (plainPassword) {
  return bcrypt.compareSync(plainPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

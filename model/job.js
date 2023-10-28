const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const JobSchema = new mongoose.Schema({
  site_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Site'
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  no_of_days: {
    type: String,
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
//   status: {
//     type: String,
//     enum:[ "vacant" , "ongoing"],
//     default:"vacant"
//   },
  position: {
    type: String,
  },
  start_time: {
    type: String,
  },
  end_time: {
    type: String,
  },
  shift_type: {
    type: String,
  },
});


const Job = mongoose.model('Job', JobSchema);

module.exports = Job;

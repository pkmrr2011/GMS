const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const DutySchema = new mongoose.Schema({
  site_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Site'
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  job_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Job'
  },
  status: {
    type: String,
    // enum:[ "present" , "absent" , leave],
    default:"present"
  },
  checkin_time: {
    type: String,
  },
  checkout_time: {
    type: String,
  },
  is_incident: {
    type: Boolean,
    default:false
  },
  incident_images: {
    type: [String],
  },
  incident_comment: {
    type: String,
  },
  incident_time: {
    type: String,
  },
  daily_report_images: {
    type: [String],
  },
  daily_report_comment: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
});


const Duty = mongoose.model('Duty', DutySchema);

module.exports = Duty;

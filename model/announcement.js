const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  content: {
    type: String,
  },
  uploaded_by: {
    type: String,
    default:"Admin"
  },
});


const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;

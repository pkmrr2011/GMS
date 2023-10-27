const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const siteSchema = new mongoose.Schema({
  site_name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  any_prequation: {
    type: [String],
  },
  servelance_type: {
    type: String,
    // enum:[ "full" , "main", "gate", "outer"]
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
    nearest_police_station: {
        type: String,
      },
      nearest_fire_brigade: {
        type: String,
      },
    country: {
      type: String,
    },
  },
  owner_detail: {
    name: {
      type: String,
    },
    phone_no: {
      type: String,
    },
    alternate_phone_no: {
      type: String,
    },
    email: {
      type: String,
    },
  },
});


const Site = mongoose.model('Site', siteSchema);

module.exports = Site;


const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password : {
    type: String,
    required: true
  },
  name : {
    type : String,
    required: true
  },
  points : {
    type : Number,
    required: true
  },
  type : {
    type : String,
    required: true
  },
  kt_given : {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose')

const Constant = new mongoose.Schema({
  kt_id: {
    type: Number,
    required: true
  },
  event_creation_point : {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Constant', Constant);
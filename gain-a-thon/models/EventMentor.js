const mongoose = require('mongoose')

const EventMentorSchema = new mongoose.Schema({
  kt_id: {
    type: Number,
    required: true
  },
  mentor_email : {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('EventMentor',EventMentorSchema);
const mongoose = require('mongoose')

const EventMenteeSchema = new mongoose.Schema({
  kt_id: {
    type: Number,
    required: true
  },
  mentee_email : {
    type: String,
    required: true
  },
  acknowledgement :{
    type : Number,
    required: true
  }
})

module.exports = mongoose.model('EventMentee', EventMenteeSchema);
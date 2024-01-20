const mongoose = require('mongoose')

const KTSchema = new mongoose.Schema({
  kt_id: {
    type: Number,
    required: true
  },
  kt_link : {
    type: String,
    required: true
  },

  kt_topic :{
    type : String,
    required: true
  },

  kt_desc :{
    type : String,
    required: true,
    maxlength: 200 
  },
  kt_image_link:{
    type:String,
    required:true
  }
})

module.exports = mongoose.model('KT',KTSchema);
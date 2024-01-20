const mongoose = require('mongoose')

const storeSchema = new mongoose.Schema({
  item_id: {
    type: Number,
    required: true
  },
  item_name : {
    type: String,
    required: true
  },
  item_count: {
    type : Number,
    required: true
  },
  item_cost : {
    type : Number,
    required: true
  },
  item_link : {
    type : String,
    required : true
  }
})

module.exports = mongoose.model('Store', storeSchema);
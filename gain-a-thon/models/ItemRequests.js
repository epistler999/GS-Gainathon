const mongoose = require('mongoose')
const itemRequestSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    item_name : {
        type: String,
        required: true
    },
    item_id :{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('ItemRequests', itemRequestSchema);
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Message = new Schema({
    room: {
        type: String,
        required:true
    },
    user: {
        type: String,
        required:true
    },
    message: String,
    date: {
        type: Date,
        default: Date.now
    },
    color: String

})

module.exports = mongoose.model('Message', Message)
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Room = new Schema({
    title: {
        type: String,
        required:true,
        unique:true
    },
    description: String,
    parents: [],
    channels: []
})

module.exports = mongoose.model('Room', Room)
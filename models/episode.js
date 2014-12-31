var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Episode = new Schema({
    title: {
        type: String,
        required:true,
        unique:true
    },
    description: String,
    link: String,
    url: { 
        type: String, 
        required:true,
        unique:true
    },
    date: Date,
    channel: String,
    duration: String
})

module.exports = mongoose.model('Episode', Episode)
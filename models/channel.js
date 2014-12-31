var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Channel = new Schema({
    title: {
        type: String,
        required:true
    },
    type: String,
    description: String,
    website: String,
    feed: { 
        type: String, 
        required:true,
        unique:true
    },
    feeds: Number,
    filter: String,
    language: String,
    update_date: Date
})

module.exports = mongoose.model('Channel', Channel)
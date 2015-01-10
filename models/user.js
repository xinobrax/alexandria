var mongoose = require('mongoose')
var Schema = mongoose.Schema
var passportLocalMongoose = require('passport-local-mongoose')

var User = new Schema({
    username: { 
        type: String, 
        unique: true
    },
    password: String,
    status: String,
    registration: Date,
    last_login: Date,
    email: String,
    email_privacy: String,
    jabber: String,
    jabber_privacy: String,
    toxid: String,
    toxid_privacy: String,
    diaspora: String,
    diaspora_privacy: String,
    bitcoin: String,
    bitcoin_privacy: String,
    channels: [],
    rooms: [],
    friends: []
})

User.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', User)
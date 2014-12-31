var path = require('path')
var express = require('express')
var app = express()
var http2 = require('http')
var http = require('http').Server(app)
var fs = require('fs');
var gm = require('gm')  // Resize Image
var ejs = require('ejs')
var io = require('socket.io')(http)
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var session = require('express-session')


////////////////////////////////////////////////////////////////////////////////
//
// Basic Setup
//
////////////////////////////////////////////////////////////////////////////////

// Alexandria Modules
var feedParser = require('./modules/feedParser.js')
var formatChatMessage = require('./modules/formatChatMessage.js')


// Mongoose Models
var User = require('./models/user')
var Channel = require('./models/channel')
var Episode = require('./models/episode')
var Message = require('./models/message')

// Globals
var username = ''
var userlist = {}

// Connect to Database
mongoose.connect('mongodb://localhost/alexandria_dev')

// App Use
app.use(express.static("public"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'all hail discordia',
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

// App Set
app.set('view engine', 'ejs')

// Passport Config
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Routes
require('./routes')(app)


////////////////////////////////////////////////////////////////////////////////
//
// Sockets > Root
//
////////////////////////////////////////////////////////////////////////////////

root = io.of('/root')

root.on('connection', function(socket){
    
    var username = require('./routes').username
    socket.username = username
    userlist[socket.username] = socket.username
    
    
    console.log('connected')
    
    // Temp
    socket.join('alexandria')
    socket.join('bitcoin')
        
        
    socket.emit('setUserlist', userlist)    
 
    socket.on('chatMessage', function (msg) {
       
        msg.message = formatChatMessage.formatChatMessage(msg.message)
        
        if(msg.message.search('/color') !== -1){
            msg.color = msg.message.substring(7)
        }
        
        msg.username = socket.username
    
        newMessage = new Message(msg)
        newMessage.save(function(err, newMessage){
            if(err) console.error(err)
        })
        
        root.to(msg.room).emit('chatMessage', msg)
        console.log(msg.room + ': (' + msg.user + ') ' + msg.message)
    })
    
    socket.on('joinRoom', function(room){
        socket.join(room)
        console.log('User joined ' + room)
    }) 
    
    socket.on('getRoomHistory', function(room){
        Message.find({ room:room }).sort({ date:'asc' }).exec(function(err, roomHistory){
            if(err) console.error(err)
            socket.emit('getRoomHistory', roomHistory) 
        })    
    })         
    
    socket.on('disconnect', function(){
        console.log('User disconnected')
        delete userlist[socket.username]
    })           
    
    console.log('New user connected')
    
})

////////////////////////////////////////////////////////////////////////////////
//
// Sockets > Admin Settings
//
////////////////////////////////////////////////////////////////////////////////

settingsChannel = io.of('/settings')
settingsChannel.on('connection', function(socket){
        
    socket.on('fetchFeed', function (feedurl) {        
        feedParser.fetchFeedMeta(feedurl, function(data){
            socket.emit('fetchFeed', data)    
        })
    })
    
    socket.on('addChannel', function (channel) {

        // Fetch Channel Image, resize, save
        newChannel = new Channel(channel)
        var imgpath = './public/images/channels/' + newChannel._id
        var request = http2.get(channel.image , function(response) {
            var imageMagick = gm.subClass({ imageMagick: true })
            imageMagick(response).resize(200, 200).write(imgpath + '.jpg', function(err, response){
                imageMagick(imgpath + '.jpg').resize(40, 40).write('./public/images/channels/icons/' + newChannel._id + '.jpg', function(err){

                    feedParser.fetchFeeds(newChannel._id, newChannel.feed, function(data){
                        if(err) console.error(err)
                    })
                })
            })              
        })

        newChannel.save(function(err, newChannel){
            if(err) console.error(err)
        })
    })
    
    socket.on('getUserProfile', function (userId) {
        User.findOne({ _id:userId }, function(err, userProfile){
            if(err) console.error(err)
            socket.emit('getUserProfile', userProfile) 
        })              
    })
    
    socket.on('setUserProfile', function (userId, user) {
        User.update(userId, user, function(err){
            if(err) console.error(err)
        })           
        console.log(user)
    })
    
    socket.on('disconnect', function(){
        //console.log('User disconnected')        
    })
})

////////////////////////////////////////////////////////////////////////////////
//
// Sockets > Backend
//
////////////////////////////////////////////////////////////////////////////////
backend = io.of('/backend')
backend.on('connection', function(socket){
    
    socket.on('loadChannelList', function (settings) {        
        Channel.find(function(err, channelList){
            if(err) console.error(err)
            socket.emit('loadChannelList', channelList)   
        })     
    })
    
    socket.on('loadChannelDetails', function (channelId) {    
        console.log(channelId)
        Channel.findOne({ _id:channelId }, function(err, channelDetails){
            if(err) console.error(err)
            socket.emit('loadChannelDetails', channelDetails)   
        })     
        
        Episode.find({ channel:channelId }).sort({ date:'desc' }).exec(function(err, channelEpisodes){
            if(err) console.error(err)
            socket.emit('loadChannelEpisodes', channelEpisodes) 
        })
    })
})


http.listen(1337, function(){
  console.log('listening on *:1337')
})
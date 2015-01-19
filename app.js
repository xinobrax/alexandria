var path = require('path')
var express = require('express')
var app = express()
var http2 = require('http')
var http = require('http').Server(app)
var fs = require('fs')
var gm = require('gm')  // Resize Image
var ejs = require('ejs')
var io = require('socket.io')(http)
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var bodyParser = require('body-parser')
var session = require('express-session')
var bcrypt = require('bcrypt-nodejs')
var mysql      = require('mysql')
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'alexandria',
    password : '',
    database : 'alexandria'
})


////////////////////////////////////////////////////////////////////////////////
//
// Basic Setup
//
////////////////////////////////////////////////////////////////////////////////

// Alexandria Modules
var feedParser = require('./modules/feedParser.js')
var formatChatMessage = require('./modules/formatChatMessage.js')

// Mongoose Models
var DB = require('./models/user')
var Channel = require('./models/channel')
var Episode = require('./models/episode')
var Message = require('./models/message')
var Room = require('./models/room')

// Globals
var username = ''
var userlist = {}

// Passport Config
passport.use(new LocalStrategy(function(username, password, done) {
    new DB.User({username:username}).fetch().then(function(data) {
        var user = data
        if(user === null) {
            return done(null, false, {message: 'Invalid username or password'})
        }else{
            user = data.toJSON()
            if(!bcrypt.compareSync(password, user.password)) {
                return done(null, false, {message: 'Invalid username or password'})
            }else{
                return done(null, user)
            }
        }
    })
}))

passport.serializeUser(function(user, done) {
    done(null, user.username)
})

passport.deserializeUser(function(username, done) {
    new DB.User({username: username}).fetch().then(function(user) {
        done(null, user)
    })
})

// App Use
app.use(express.static('public'))
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
    
    // Temp Auto Join
    socket.join('1') // Alexandria
    socket.join('2') // Bitcoin
                
    socket.emit('setUserlist', userlist)    
 
    socket.on('chatMessage', function (msg) {
       
        msg.message = formatChatMessage.formatChatMessage(msg.message)
        
    
        new DB.Message(msg).save().then(function(){})
        msg.username = socket.username
        root.to(msg.room_idfs).emit('chatMessage', msg)
    })
    
    socket.on('joinRoom', function(room_idfs){
        socket.join(room_idfs)
        console.log('User joined ' + room_idfs)
    }) 
    
    socket.on('getRoomHistory', function(room){
        new DB.Room().where({ room_id:room }).fetch({ withRelated:['messages.user'] }).then(function(roomHistory){
            roomHistory = JSON.stringify(roomHistory)
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
        
    socket.on('fetchFeed', function (feedurl, type) {        
        feedParser.fetchFeedMeta(type, feedurl, function(data){
            socket.emit('fetchFeed', data)    
        })
    })

    socket.on('addChannel', function (channel, img) {
        // Fetch Channel Image, resize, save
        new DB.Channel(channel).save().then(function(model){
            
            var imgpath = './public/images/channels/' + model['id']
            if(img.substring(0,2) == '//'){
                img = 'http:' + img
            }
            
            var request = http2.get(img , function(response) {
                var imageMagick = gm.subClass({ imageMagick: true })
                imageMagick(response).resize(200, 200).write(imgpath + '.jpg', function(err, response){
                    imageMagick(imgpath + '.jpg').resize(40, 40).write('./public/images/channels/icons/' + model['id'] + '.jpg', function(err){
                        feedParser.fetchFeeds(model['id'], model['attributes']['feed'], model['attributes']['type_idfs'], model['attributes']['filter'], function(data){
                            if(err) console.error(err)
                        })
                    })
                })              
            })
        })

    })
    
    socket.on('getUserProfile', function (userId) {
        DB.User({ user_id:userId }).fetch().then(function(userProfile){
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
    
    socket.on('addRoom', function (room) {
        newRoom = new Room(room)
        console.log(newRoom)
        newRoom.save(function(err, newRoom){
            if(err) console.error(err)
        })
    })
        
    socket.on('getRoomTree', function () {        
        Room.find(function(err, rooms){
            if(err) console.error(err)
            socket.emit('getRoomTree', rooms) 
        })   
    })
    
    socket.on('getRoomList', function () {        
        Room.find(function(err, rooms){
            if(err) console.error(err)
            socket.emit('getRoomList', rooms) 
        })   
    })

    socket.on('loadChannelList', function(userId){
        var query = 'SELECT * FROM channels LEFT JOIN (x_user_channel) ON (channels.channel_id = x_user_channel.channel_idfs AND x_user_channel.user_idfs = ' + userId + ')'
        new DB.Query.knex.raw(query, [1]).then(function(channelList){
            channelList = JSON.stringify(channelList[0])
            socket.emit('loadChannelList', channelList)            
        })
    })

    socket.on('loadChannelDetails', function(channelId){
        new DB.Channel({ channel_id:channelId }).fetch().then(function(channelDetails){
            socket.emit('loadChannelDetails', channelDetails)
            
            new DB.Episode().query().where({channel_idfs:channelId}).select().then(function(channelEpisodes){
                socket.emit('loadChannelEpisodes', channelEpisodes)    
            })
        })

    })

    socket.on('getYoutubeUrl', function(ytid){
        feedParser.getYoutubeUrl(ytid, function(yturl){
            socket.emit('getYoutubeUrl', yturl)
            //console.log('Got ytid: ' + yturl)
        })
    })
})


////////////////////////////////////////////////////////////////////////////////
//
// Update Feeds
//
////////////////////////////////////////////////////////////////////////////////

var interval = 10 // Minutes

setInterval(function() {

    new DB.Channel().query().then(function(channelList){

        channelList.forEach(function(channel){
            
            feedParser.fetchFeeds(channel['channel_id'], channel['feed'], channel['type_idfs'], channel['filter'], function(err, data){
                if(err) console.error(err)          
            
                new DB.Episode().count(channel['channel_id'], function(err, count){
                    if(err) console.error(err)
                    
                    count = count[0]['count(*)']
                    new DB.Channel({ channel_id:channel['channel_id'] }).save({ feeds:count }).then(function(model){
                    })
                })
            })  
            
        })
    })
}, 60000 * interval);


////////////////////////////////////////////////////////////////////////////////
//
// Start Server
//
////////////////////////////////////////////////////////////////////////////////

http.listen(1337, function(){
  console.log('listening on *:1337')
})
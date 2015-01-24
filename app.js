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

// DB
var DB = require('./models/user.js')

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
    var userId = require('./routes').userId
    socket.username = username
    socket.userId = userId
    userlist[socket.username] = { userId: socket.userId, username: socket.username }
        
    console.log('connected')
    
    // Temp Auto Join
    socket.join('1') // Alexandria
    socket.join('2') // Bitcoin
                
    socket.emit('setUserlist', userlist)    
 
    socket.on('chatMessage', function (msg) {
        console.log(msg.message)
        if(msg.message.indexOf('/addChannel') != -1){
            socket.emit('chatCommandAddChannel', socket.userId)
        }else{
            msg.message = formatChatMessage.formatChatMessage(msg.message)


            new DB.Message(msg).save().then(function(){})
            msg.username = socket.username
            root.to(msg.room_idfs).emit('chatMessage', msg)
        }
    })
    
    socket.on('joinRoom', function(room_idfs){
        socket.join(room_idfs)
        console.log(socket.username + ' joined ' + room_idfs)
    }) 
    
    socket.on('getRoomHistory', function(room){
        new DB.Room().where({ room_id:room }).fetch({ withRelated:['messages.user'] }).then(function(roomHistory){
            roomHistory = JSON.stringify(roomHistory)
            socket.emit('getRoomHistory', roomHistory) 
        })    
    })         
    
    socket.on('disconnect', function(){
        console.log(socket.username + ' disconnected')
        delete userlist[socket.username]
    })           
    
    console.log(socket.username + ' connected')
    
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
                        feedParser.fetchFeeds(model['id'], model['attributes']['feed'], model['attributes']['type_idfs'], model['attributes']['filter'], '0',  function(data){
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
    
    socket.on('getUserChannels', function (userId) {
        var query = ''
        query += 'SELECT '
        query += '    channel_id, '
        query += '    channels.title, '
        query += '    feeds, '
        query += '    COUNT(episode_idfs) AS c '
        query += 'FROM '
        query += '    channels '
        query += 'INNER JOIN '
        query += '    (x_user_channel) '
        query += 'ON '
        query += '    (channels.channel_id = x_user_channel.channel_idfs '
        query += '    AND x_user_channel.user_idfs = ' + userId + ')'
        query += 'LEFT JOIN '
        query += '    (x_user_episode, episodes)'
        query += 'ON'
        query += '    (episodes.channel_idfs = channel_id '
        query += '    AND episode_id = x_user_episode.episode_idfs '
        query += '    AND x_user_episode.user_idfs = ' + userId + ') '
        query += '    AND x_user_episode.status = 1 '
        query += 'GROUP BY'
        query += '    update_date desc'
        new DB.Query.raw(query, [1]).then(function(userChannels){
            userChannels = JSON.stringify(userChannels[0])
            socket.emit('getUserChannels', userChannels)            
        })
    })
    
    socket.on('getUserPlaylist', function (userId) {
        /*
        var query = ''
        new DB.Query.raw(query, [1]).then(function(userPlaylist){
            userPlaylist = JSON.stringify(userPlaylist[0])
            socket.emit('getUserPlaylist', userPlaylist)            
        })
        */
    })
    
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
        var query = ''
        query += 'SELECT '
        query += '    channel_id, '
        query += '    channels.title, '
        query += '    type_idfs, '
        query += '    feeds, '
        query += '    channels.language_idfs, '
        query += '    x_user_channel.user_idfs,'
        query += '    COUNT(episode_idfs) AS c '
        query += 'FROM '
        query += '    channels '
        query += 'LEFT JOIN '
        query += '    (x_user_channel) '
        query += 'ON '
        query += '    (channels.channel_id = x_user_channel.channel_idfs '
        query += '    AND x_user_channel.user_idfs = ' + userId + ') '
        query += 'LEFT JOIN '
        query += '    (episodes) '
        query += 'ON '
        query += '    (episodes.channel_idfs = channel_id) '        
        query += 'LEFT JOIN '
        query += '    (x_user_episode)'
        query += 'ON'
        query += '    (episode_id = x_user_episode.episode_idfs '
        query += '    AND x_user_episode.user_idfs = ' + userId + ') '
        query += '    AND x_user_episode.status = 1 '
        query += 'GROUP BY'
        query += '    update_date desc'
        //console.log(query)
        new DB.Query.raw(query, [1]).then(function(channelList){
            channelList = JSON.stringify(channelList[0])
            socket.emit('loadChannelList', channelList)            
        })
    })

    socket.on('loadChannelDetails', function(channelId, userId){
        
        var query = ''
        query += 'SELECT '
        query += '    channel_id, '
        query += '    channels.title, '
        query += '    channels.description, '
        query += '    type_idfs, '
        query += '    feeds, '
        query += '    channels.language_idfs, '
        query += '    x_user_channel.user_idfs, '
        query += '    COUNT(episode_idfs) AS c, '
        query += '    languages.title_en AS language '
        query += 'FROM '
        query += '    channels '
        query += 'LEFT JOIN '
        query += '    (x_user_channel) '
        query += 'ON '
        query += '    (channels.channel_id = x_user_channel.channel_idfs '
        query += '    AND x_user_channel.user_idfs = ' + userId + ') '
        query += 'RIGHT JOIN '
        query += '    (languages) '
        query += 'ON '
        query += '    language_id = channels.language_idfs '
        query += 'LEFT JOIN '
        query += '    (x_user_episode, episodes) '
        query += 'ON '
        query += '    (episodes.channel_idfs = channel_id '
        query += '    AND episode_id = x_user_episode.episode_idfs '
        query += '    AND x_user_episode.user_idfs = ' + userId + ') '
        query += '    AND x_user_episode.status = 1 '
        query += 'WHERE '
        query += '    channel_id = ' + channelId
        //console.log(query)
        new DB.Query.raw(query, [1]).then(function(channelDetails){
            channelDetails = JSON.stringify(channelDetails[0])
            socket.emit('loadChannelDetails', channelDetails)
        
            var query2 = 'SELECT * FROM episodes LEFT JOIN (x_user_episode) ON (episode_id = episode_idfs) WHERE channel_idfs = ' + channelId + ' AND active = 1 ORDER BY date desc'
            new DB.Query.raw(query2, [1]).then(function(channelEpisodes){
                channelEpisodes = JSON.stringify(channelEpisodes[0])
                socket.emit('loadChannelEpisodes', channelEpisodes)    
            })
        })
    })
    
    socket.on('subscribeChannel', function(channelId, userId){
        var query = 'INSERT INTO x_user_channel (user_idfs, channel_idfs) VALUES (\'' + userId + '\', \'' + channelId + '\')'
        new DB.Query.raw(query, [1]).then(function(subscribe){})
    })

    socket.on('unsubscribeChannel', function(channelId, userId){
        var query = 'DELETE FROM x_user_channel WHERE user_idfs = ' + userId + ' AND channel_idfs = ' + channelId
        new DB.Query.raw(query, [1]).then(function(unsubscribe){})
    })
    
    
    socket.on('flagAllDone', function(channelId, userId){        
        
        // Get all Episodes from Channel
        var query = 'SELECT episode_id FROM episodes WHERE channel_idfs = ' + channelId
        new DB.Query.raw(query, [1]).then(function(channelEpisodes){
            channelEpisodes = JSON.stringify(channelEpisodes[0])
            channelEpisodes = JSON.parse(channelEpisodes)
            
            // Insert all Episodes
            channelEpisodes.forEach(function(episode){

                var query2 = 'INSERT INTO x_user_episode (user_idfs, episode_idfs, status) VALUES (\'' + userId + '\', \'' + episode['episode_id'] + '\', \'1\')'
                new DB.Query.raw(query2, [1]).then(function(){    
                }).catch(function(err){})
                var query3 = 'UPDATE episodes, x_user_episode SET status = 1 WHERE episode_id = episode_idfs AND user_idfs = ' + userId + ' AND channel_idfs = ' + channelId
                new DB.Query.raw(query3, [1]).then(function(){
                })
            })
        })
    })
    
    socket.on('flagAllNew', function(channelId, userId){
        var query = 'UPDATE episodes, x_user_episode SET status = 0 WHERE episode_id = episode_idfs AND user_idfs = ' + userId + ' AND channel_idfs = ' + channelId
        new DB.Query.raw(query, [1]).then(function(){
        })
    })    

    socket.on('getYoutubeUrl', function(ytid){
        feedParser.getYoutubeUrl(ytid, function(yturl){
            socket.emit('getYoutubeUrl', yturl)
        })
    })
})


////////////////////////////////////////////////////////////////////////////////
//
// Update Feeds
//
////////////////////////////////////////////////////////////////////////////////

function updateFeeds(){
    

    new DB.Query.raw(DB.getChannelsByLatestEpisode(), [1]).then(function(channelList){
        channelList = JSON.stringify(channelList[0])
        channelList = JSON.parse(channelList)

        channelList.forEach(function(channel){

            //console.log(channel['feed'])
            feedParser.fetchFeeds(channel['channel_id'], channel['feed'], channel['type_idfs'], channel['filter'], channel['date'], function(err, data){
                //if(err) console.error(err)          
            
                var query2 = 'SELECT COUNT(episode_id) FROM episodes WHERE channel_idfs = ' + channel['channel_id']
                new DB.Query.raw(query2, [1]).then(function(count){
                    //if(err) console.error(err)
                    count = JSON.stringify(count[0])
                    count = JSON.parse(count)
                    count = count[0]['COUNT(episode_id)']
                    var query = 'SELECT date FROM episodes WHERE channel_idfs = ' + channel['channel_id'] + ' ORDER BY date desc LIMIT 1'
                    new DB.Query.raw(query, [1]).then(function(lastUpdate){
                    
                        lastUpdate = JSON.stringify(lastUpdate[0])
                        lastUpdate = JSON.parse(lastUpdate)
                        new DB.Channel({ channel_id:channel['channel_id'], update_date:lastUpdate[0]['date'] }).save({ feeds:count }).then(function(model){
                        })
                    })
                })
            })  
        })
    })
}

updateFeeds()

var interval = 10 // Minutes
setInterval(function() {
    updateFeeds()
}, 60000 * interval);


////////////////////////////////////////////////////////////////////////////////
//
// Start Server
//
////////////////////////////////////////////////////////////////////////////////

http.listen(1337, function(){
  console.log('listening on *:1337')
})
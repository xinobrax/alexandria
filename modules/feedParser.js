////////////////////////////////////////////////////////////////////////////////
//
// Fetch Feed Meta
//
////////////////////////////////////////////////////////////////////////////////

var DB = require('../models/user')
var FeedParser = require('feedparser')
var request = require('request')
var youtube = require('youtube-dl')
var http = require('http')
var html_strip = require('htmlstrip-native')

var options = {
    include_script : false,
    include_style : false,
    compact_whitespace : true,
    include_attributes : false
}

exports.fetchFeedMeta = function(type, url, callback){
    
    var feedparser = new FeedParser()
    console.log(type)
    try {
        if(type == 'rss'){
            fetch = request(url)
        }else if(type == 'youtube'){
            fetch = request('https://gdata.youtube.com/feeds/api/users/' + url + '/uploads')
            var img = request({url: 'http://gdata.youtube.com/feeds/api/users/' + url + '?fields=media:thumbnail&alt=json', json: true}, function(err, response, body) {
                if (!err && response.statusCode === 200) {
                    img = body['entry']['media$thumbnail']['url']
                }
            })
        }
        
        var feed = {}

        fetch.on('error', function(err){
            console.error(err)
        })

        fetch.on('response', function(res){
            var stream = this

            if(res.statusCode != 200)
                return this.emit('error', new Error('Bad status code'))

            stream.pipe(feedparser)
        })

        feedparser.on('error', function(err){
            console.error(err)
        })

        feedparser.on('readable', function(){
            if(type == 'rss'){
                feed = { title: this.meta['title'], description: this.meta['description'], website: this.meta['link'], image: this.meta['image']['url']  }
            }else if(type == 'youtube'){
                feed = { title: this.meta['title'], description: this.meta['description'], website: this.meta['link'], image:img  }
            }

            this.read()
        })

        feedparser.on('end', function(){
            callback(feed)
        })  
    } catch (err) {
        console.error(err)
        //callback('error')
    }
  
}


////////////////////////////////////////////////////////////////////////////////
//
// Fetch Feeds
//
////////////////////////////////////////////////////////////////////////////////

var Episode = require('../models/episode')

exports.fetchFeeds = function(channelId, feedUrl, type, filter, date, callback){

    var feedparser = new FeedParser()
    if(type == '1' || type == '2' || type == '3'){
        var fetch = request(feedUrl)
    }else if(type == '4'){
        var fetch = request('https://gdata.youtube.com/feeds/api/users/' + feedUrl + '/uploads')
    }
    
    var feeds = {}

    fetch.on('error', function(err){
        console.error(err)
    })

    fetch.on('response', function(res){
        var stream = this

        if(res.statusCode != 200)
            return this.emit('error', new Error('Bad status code'))

        stream.pipe(feedparser)
    })

    feedparser.on('error', function(err){
        console.error(err)
    })

    feedparser.on('readable', function(err){
        if(err) console.error(err)
            
        var item
        while (item = this.read()) {
            
            var dateLatest = Number(new Date(date))           
            if(type == '4'){
                var dateEpisode = Number(new Date(item['pubDate']))
            }else{
                var dateEpisode = Number(new Date(item['date']))
            }

            if(item['title'].search(filter) !== -1 && dateEpisode > dateLatest){
                
                var description = item['description']
                if(description){
                    description = html_strip.html_strip(description, options)
                }
                
                if(type == '1' || type == '2'){
                    var episode = {
                        title: item['title'],
                        description: description,
                        url: item['enclosures'][0]['url'],
                        link: item['url'],
                        date: item['date'],
                        duration: item['enclosures'][0]['length'],
                        channel_idfs: channelId
                    }
                }else if(type == '4'){
                    var ytid = item['link']
                    ytid = ytid.substring(32, 43)
                    var episode = {
                        title: item['title'],
                        description: description,
                        url: ytid,
                        link: 'https://www.youtube.com/watch?v=' + ytid,
                        date: item['pubDate'],
                        duration: item['media:group']['yt:duration']['@']['seconds'],
                        channel_idfs: channelId
                    }
                }                    
                
                new DB.Episode(episode).save().then(function(err, newEpisode){
                    if(err) console.error(err)
                    console.log('Neue Episode: ' + newEpisode)
                    console.log('Add to Playlist')
                }).catch(function(err){
                    console.error(err)
                })
            }
         }
    })

    feedparser.on('end', function(){
        callback('ok')
    })    
}

exports.getYoutubeUrl = function(ytid, callback){
    var url = 'https://www.youtube.com/watch?v=' + ytid
    youtube.getInfo(url, function(err, info){
    //youtube.getInfo(url, ['--max-quality=247'], function(err, info){
    //youtube.getInfo(url, ['--format=mp4'], function(err, info){
        if(err) console.error(err)
        
        youtube.getFormats(url, function(err, formats) {
            if (err) throw err

                /*
                formats.forEach(function(format) {
                    console.log(format)
                })
                */
            })
        
        // Send back
        callback(info.url)
    })
}
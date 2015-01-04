////////////////////////////////////////////////////////////////////////////////
//
// Fetch Feed Meta
//
////////////////////////////////////////////////////////////////////////////////

var FeedParser = require('feedparser')
var request = require('request')
var youtube = require('youtube-dl')

exports.fetchFeedMeta = function(url, callback){
    
    var feedparser = new FeedParser()
    var fetch = request(url)
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
         feed = { title: this.meta['title'], description: this.meta['description'], website: this.meta['link'], image: this.meta['image']['url']  }
         var item
         
         while (item = this.read()) {
             //console.log(item['media:group']['yt:duration']['@']['seconds'])
         }
    })

    feedparser.on('end', function(){
        callback(feed)
    })    
}


////////////////////////////////////////////////////////////////////////////////
//
// Fetch Feeds
//
////////////////////////////////////////////////////////////////////////////////

var Episode = require('../models/episode')

exports.fetchFeeds = function(channelId, feedUrl, type, filter, callback){

    var feedparser = new FeedParser()
    var fetch = request(feedUrl)
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
            
            if(item['title'].search(filter) !== -1){
                if(type == 'audio_podcast' || type == 'video_podcast'){
                    var episode = new Episode({
                        title: item['title'],
                        description: item['description'],
                        url: item['enclosures'][0]['url'],
                        link: item['url'],
                        date: item['date'],
                        duration: item['enclosures'][0]['length'],
                        channel: channelId
                    })
                }else if(type == 'video_youtube'){
                    var ytid = item['link']
                    ytid = ytid.substring(32, 43); 
                    var episode = new Episode({
                        title: item['title'],
                        description: item['description'],
                        url: ytid,
                        link: 'https://www.youtube.com/watch?v=' + ytid,
                        date: item['pubDate'],
                        duration: item['media:group']['yt:duration']['@']['seconds'],
                        channel: channelId
                    })
                }                    
                
                episode.save(function(err, episodes){
                    if(err) console.error(err)
                })
            }
         }
    })

    feedparser.on('end', function(){
        //console.log(feed)
        //callback(feed)
        // Eintrag in DB
    })    
}

exports.getYoutubeUrl = function(ytid, callback){
    var url = 'https://www.youtube.com/watch?v=' + ytid
    youtube.getInfo(url, function(err, info){
        if(err) console.error(err)
        // Send back
        callback(info.url)
    })
}
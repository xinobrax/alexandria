////////////////////////////////////////////////////////////////////////////////
//
// Fetch Feed Meta
//
////////////////////////////////////////////////////////////////////////////////

var FeedParser = require('feedparser')
var request = require('request')

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

exports.fetchFeeds = function(channelId, feedUrl, callback){

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

    feedparser.on('readable', function(){
        var item

        while (item = this.read()) {
            var episode = new Episode({
                title: item['title'],
                description: item['description'],
                url: item['enclosures'][0]['url'],
                link: item['url'],
                date: item['date'],
                duration: item['enclosures'][0]['length'],
                channel: channelId
            })

            episode.save(function(err, episodes){
                if(err) console.error(err)
            })
         }
    })

    feedparser.on('end', function(){
        //console.log(feed)
        //callback(feed)
        // Eintrag in DB
    })    
}
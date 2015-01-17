var settingsChannel = io('/settings')
var backend = io('/backend')


////////////////////////////////////////////////////////////////////////////////
//
// Add New Channel
//
////////////////////////////////////////////////////////////////////////////////

function fetchNewFeed(){
    if($('input[name=feedurl]').val()){
        settingsChannel.emit('fetchFeed', $('input[name=feedurl]').val(), $('#type').val())
    }else{
        $('.loading').hide()
        $('input[name=feedurl]').css('background-color', 'rgba(255,0,0,0.2)')            
        $('#1').show()
        $('#2').show()
    }       
}

function addChannel(){
    var channel = {
        title: $('input[name=title]').val(),
        type: $('select[name=type]').val(),
        description: $('textarea[name=description]').val(),
        website: $('input[name=website]').val(),
        feed: $('input[name=feedurl]').val(),
        image: $('#addChannelImage').attr('src'),
        feeds: 0,
        filter: $('input[name=filter]').val(),
        language: $('select[name=language]').val(),
        update_date: new Date(),        
    }
    settingsChannel.emit('addChannel', channel)
}


$( document ).ready(function() {
    
    $('.content_box').on('click', 'button[name=fetchfeed]', function(){
        $('#1').hide()
        $('#2').hide()
        $('.loading').show()        
        fetchNewFeed()
    })
    
    settingsChannel.on('fetchFeed', function(feed){   
        
        $('.loading').hide()
        
        if(feed !== 'error'){
            $('input[name=title]').val(feed.title)
            $('textarea[name=description]').val(feed.description)
            $('input[name=website]').val(feed.website)
            $('#addChannelImage').attr('src', feed.image)
            $('#3').show(400)
            $('#4').show(400)
            $('#5').show(400)
        }else{
            $('input[name=feedurl]').css('background-color', 'rgba(255,0,0,0.2)')            
            $('#1').show()
            $('#2').show()
        }        
    })
    
    $('.content_box').on('click', '.addChannelSourceButton', function(){
        var channelSource = $(this).attr('id')
        $('#type').val(channelSource)
        
        switch(channelSource){
            case 'rss':
                $(this).parent('div').next().children('h2').html('2. Type in the URL of an RSS Feed')                
                break;
            case 'youtube':
                $(this).parent('div').next().children('h2').html('2. Type in the name of a Youtube channel')
                break;
            case 'soundcloud':
                $(this).parent('div').next().children('h2').html('2. Type in the name of a Soundcloud profile')
                break;
            case 'twitter':
                $(this).parent('div').next().children('h2').html('2. Type in a hashtag (#) or the name of a Twitter account (@)')
                break;
        }
        
        $('#2').show(400)
    })
    
})


////////////////////////////////////////////////////////////////////////////////
//
// Load Channel List
//
////////////////////////////////////////////////////////////////////////////////

function loadChannelList(){
    backend.emit('loadChannelList', '')
}

backend.on('loadChannelList', function(channelList){    

    var list = ''
    list += '<div class=\'browseChannelsChannelRow\'>'
    list += '<h2>Technology</h2>'
    for(var i in channelList){

            list += '<div class=\'browseChannelsChannelBox\' id=\'' + channelList[i]['_id'] + '\'>'
                        
            list += '<img class=\'browseChannelsChannelImage\' src=\'images/channels/' + channelList[i]['_id'] + '.jpg\' width=\'120\' height=\'120\' />'
            if(channelList[i]['type'] == 'video_youtube' || channelList[i]['type'] == 'video_podcast'){
                list += '<img id=\'type\' src=\'images/icons/video.gif\' height=\'16\' style=\'position:absolute;top:0px;left:15px;border-top-left-radius:9px;border-bottom-right-radius:9px;\' />'
            }else{
                list += '<img id=\'type\' src=\'images/icons/audio.gif\' height=\'16\' style=\'position:absolute;top:0px;left:15px;border-top-left-radius:9px;border-bottom-right-radius:9px;\' />'
            }
            list += '<img id=\'subscription\' src=\'images/icons/unsubscribed.gif\' height=\'16\' style=\'position:absolute;top:104px;right:15px;border-bottom-right-radius:9px;border-top-left-radius:9px;\' />'
            list += '<img id=\'language\' src=\'images/icons/languages/' + channelList[i]['language'] + '.gif\' height=\'16\' style=\'position:absolute;top:104px;left:15px;border-bottom-left-radius:9px;border-top-right-radius:9px;\' />'
            
            list += '<div id=\'feeds\' style=\'position:absolute;top:-6px;right:9px;background:#ffc438;border-radius:12px;border:4px solid #000;width:36px;color:#000;text-shadow:none;\'><b>' + channelList[i]['feeds'] + '</b></div>'
            
            list += '<br/>' + channelList[i]['title']
            list += '</div>'
    }
    list += '</div>'

    $('.content_box').append(list)
})

$( document ).ready(function() {
    
    $('.content_box').on('click', '.browseChannelsFilterEntry', function(){
        
        $(this).parent('.browseChannelsFilterBox').children('.browseChannelsFilterEntry').css({ 'background':'rgba(255,255,255,0.3)'  })
        $(this).css({ 'background':'#c68b01'  })
        
        
        if($(this).attr('id') == 'subscription_all' || $(this).attr('id') == 'subscribed' || $(this).attr('id') == 'unsubscribed'){
            $(this).parent('.browseChannelsFilterBox').children('.filter_subscription').attr('id', $(this).attr('id'))
        }else if($(this).attr('id') == 'type_all' || $(this).attr('id') == 'video' || $(this).attr('id') == 'audio'){
            $(this).parent('.browseChannelsFilterBox').children('.filter_type').attr('id', $(this).attr('id'))
        }else if($(this).attr('id') == 'language_all' || $(this).attr('id') == 'english' || $(this).attr('id') == 'german'){
            $(this).parent('.browseChannelsFilterBox').children('.filter_language').attr('id', $(this).attr('id'))
        }
        
        var subscription = $('.filter_subscription').attr('id')
        var type = $('.filter_type').attr('id')
        var language = $('.filter_language').attr('id')
        
        $('.browseChannelsChannelBox').each(function(){
            if($(this).children('#subscription').attr('src') == 'images/icons/' + subscription + '.gif' || subscription == 'subscription_all'){
                if($(this).children('#type').attr('src') == 'images/icons/' + type + '.gif' || type == 'type_all'){
                    if($(this).children('#language').attr('src') == 'images/icons/languages/' + language + '.gif' || language == 'language_all'){
                        $(this).show('slow')
                    }else{
                        $(this).hide('slow')
                    }
                }else{
                    $(this).hide('slow')
                }
            }else{
                $(this).hide('slow')
            }
        })      
    })
})



////////////////////////////////////////////////////////////////////////////////
//
// Channels >  Load Channel Details
//
////////////////////////////////////////////////////////////////////////////////

function loadChannelDetails(channelId){
    backend.emit('loadChannelDetails', channelId)
}

backend.on('loadChannelDetails', function(channelList){       
    $('#title').append(channelList['title'])
    $('#image').attr({ src:'/images/channels/' + channelList['_id'] + '.jpg' })
    $('#description').append(channelList['description'])
    $('#website').append('<a href=\'' + channelList['website'] + '\'>' + channelList['website'] + '</a>')
    $('#language').append(channelList['language'])
    $('#feeds').append(channelList['feeds'])
    $('#update').append(new Date(channelList['update_date']))
    $('#type').val(channelList['type'])
})


////////////////////////////////////////////////////////////////////////////////
//
// Channels >  Load Episodes
//
////////////////////////////////////////////////////////////////////////////////

backend.on('loadChannelEpisodes', function(channelEpisodes){  

    var list = '<div class=\'episodesList\'>'
    list += '<div class=\'episode_info_table\'>'

    for(var i in channelEpisodes){            
        list += '<div class=\'episode_info_row\' >'
        list += '<div class=\'episode_info_cell_left\' >'
        list += '<h3>' + channelEpisodes[i]['title'] + '</h3>'
        var date = new Date(channelEpisodes[i]['date'])
        list += '<p class=\'episode_meta\'>' + date + ' | ' + channelEpisodes[i]['duration'].toHHMMSS() + '</p>'
        
        if($('#type').val() == 'video_youtube'){
            list += '<img src=\'http://img.youtube.com/vi/' + channelEpisodes[i]['url'] + '/mqdefault.jpg\' />'    
        }
        
        list += '<p class=\'episodeDescription\'>' + channelEpisodes[i]['description'] + '</p>'        
        list += '</div>'
        list += '<div class=\'episode_info_cell_right\' >'
        list += '<button class=\'episode_play_now\' id=\'' + channelEpisodes[i]['url'] + '\'><img src=\'images/icons/play.png\' height=\'14\' /> Play now</button><br/>'
        list += '<button class=\'episode_play_later\'><img src=\'images/icons/play_later.png\' height=\'14\' /> Play later</button><br/>'
        list += '<button class=\'episode_download\' id=\'' + channelEpisodes[i]['url'] + '\' ><img src=\'images/icons/download.png\' height=\'14\' /> Download</button>'
        list += '</div>'
        list += '</div>'
    }  
    list += '</div>'
    list += '</div><br/><br/>'

    $('.content_box').append(list).append(function(){        
        $('.episodesList').niceScroll({cursorcolor:'#ffc438', cursorwidth:'10px', cursoropacitymin:'0.6', background:'#584b2e', cursorborder:'0px'})
    })
})

backend.on('getYoutubeUrl', function(yturl){       
    $('#player').attr({ src:yturl }).append(function(){
        var player = document.getElementById('player')
        player.play()
    })
})
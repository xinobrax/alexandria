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
        type_idfs: $('select[name=type]').val(),
        description: $('textarea[name=description]').val(),
        website: $('input[name=website]').val(),
        feed: $('input[name=feedurl]').val(),        
        feeds: 0,
        filter: $('input[name=filter]').val(),
        language_idfs: $('select[name=language]').val(),
        update_date: new Date(),        
    }
    var img = $('#addChannelImage').attr('src')
    settingsChannel.emit('addChannel', channel, img)
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
    backend.emit('loadChannelList', readCookie('userId'))
}

backend.on('loadChannelList', function(channelList){    

    var list = ''
    list += '<div class=\'browseChannelsChannelRow\'>'
    //list += '<h2>Technology</h2>'

    channelList = JSON.parse(channelList)
    for(var i in channelList){

        list += '<div class=\'browseChannelsChannelBox\' id=\'' + channelList[i]['channel_id'] + '\'>'

        list += '<img class=\'browseChannelsChannelImage\' src=\'images/channels/' + channelList[i]['channel_id'] + '.jpg\' width=\'120\' height=\'120\' />'
        if(channelList[i]['type_idfs'] == '4' || channelList[i]['type_idfs'] == '1'){
            list += '<img id=\'type\' src=\'images/icons/video.gif\' height=\'16\' style=\'position:absolute;top:0px;left:12px;border-top-left-radius:9px;border-bottom-right-radius:9px;\' />'
        }else{
            list += '<img id=\'type\' src=\'images/icons/audio.gif\' height=\'16\' style=\'position:absolute;top:0px;left:12px;border-top-left-radius:9px;border-bottom-right-radius:9px;\' />'
        }
        if(channelList[i]['user_idfs'] == readCookie('userId')){
            list += '<img id=\'subscription\' src=\'images/icons/subscribed.gif\' height=\'16\' style=\'position:absolute;top:104px;right:12px;border-bottom-right-radius:9px;border-top-left-radius:9px;\' />'
        }else{
            list += '<img id=\'subscription\' src=\'images/icons/unsubscribed.gif\' height=\'16\' style=\'position:absolute;top:104px;right:12px;border-bottom-right-radius:9px;border-top-left-radius:9px;\' />'
        }

        list += '<img id=\'language\' src=\'images/icons/languages/' + channelList[i]['language_idfs'] + '.gif\' height=\'16\' style=\'position:absolute;top:104px;left:12px;border-bottom-left-radius:9px;border-top-right-radius:9px;\' />'

        var newEpisodes = channelList[i]['feeds'] - channelList[i]['c']
        if(newEpisodes !== 0){
            list += '<div id=\'feeds\' style=\'position:absolute;top:-6px;right:9px;background:#ffc438;border-radius:12px;border:4px solid #000;width:36px;color:#000;text-shadow:none;\'><b>' + newEpisodes + '</b></div>'
        }
        
        list += '<br/>' + channelList[i]['title']
        list += '</div>'
    }
    list += '</div>'

    $('.browseChannelsChannels').append(list).each(function(){
        $('.browseChannelsChannels').niceScroll({cursorcolor:'#ffc438', cursorwidth:'10px', cursoropacitymin:'0.6', background:'#584b2e', cursorborder:'0px'})
    })
})

$( document ).ready(function() {
    
    $('.content_box').on('click', '.browseChannelsFilterEntry', function(){
        
        $(this).parent('.browseChannelsFilterBox').children('.browseChannelsFilterEntry').css({ 'background':'rgba(255,255,255,0.3)'  })
        $(this).css({ 'background':'#c68b01'  })
        
        
        if($(this).attr('id') == 'subscription_all' || $(this).attr('id') == 'subscribed' || $(this).attr('id') == 'unsubscribed'){
            $(this).parent('.browseChannelsFilterBox').children('.filter_subscription').attr('id', $(this).attr('id'))
        }else if($(this).attr('id') == 'type_all' || $(this).attr('id') == 'video' || $(this).attr('id') == 'audio'){
            $(this).parent('.browseChannelsFilterBox').children('.filter_type').attr('id', $(this).attr('id'))
        }else if($(this).attr('id') == 'language_all' || $(this).attr('id') == '1' || $(this).attr('id') == '2'){
            $(this).parent('.browseChannelsFilterBox').children('.filter_language').attr('id', $(this).attr('id'))
        }
        
        var subscription = $('.filter_subscription').attr('id')
        var type = $('.filter_type').attr('id')
        var language = $('.filter_language').attr('id')
        
        $('.browseChannelsChannelBox').each(function(){
            if($(this).children('#subscription').attr('src') == 'images/icons/' + subscription + '.gif' || subscription == 'subscription_all'){
                if($(this).children('#type').attr('src') == 'images/icons/' + type + '.gif' || type == 'type_all'){
                    if($(this).children('#language').attr('src') == 'images/icons/languages/' + language + '.gif' || language == 'language_all'){
                        $(this).show('slow', function(){
                            $('.browseChannelsChannels').getNiceScroll().resize();
                        })

                    }else{
                        $(this).hide('slow', function(){
                            $('.browseChannelsChannels').getNiceScroll().resize();
                        })

                    }
                }else{
                    $(this).hide('slow', function(){
                        $('.browseChannelsChannels').getNiceScroll().resize();
                    })
                }
            }else{
                $(this).hide('slow', function(){
                    $('.browseChannelsChannels').getNiceScroll().resize();
                })
            }
        })   
        
    })
})



////////////////////////////////////////////////////////////////////////////////
//
// Channels >  Load Channel Details
//
////////////////////////////////////////////////////////////////////////////////

function loadChannelDetails(channelId, userId){
    backend.emit('loadChannelDetails', channelId, userId)
}

backend.on('loadChannelDetails', function(channelDetails){       
    
    channelDetails = JSON.parse(channelDetails)
    channelDetails = channelDetails[0]
    
    if(channelDetails['user_idfs']){
        $('.subscribe').css({ 'border-color':'#FF0000', 'color':'#FF0000' })
        $('.subscribe').html('Unsubscribe')
        $('.subscribe').attr('class', 'unsubscribe')
    }
    
    createCookie('channel', channelDetails['channel_id'], 1)
    //$('#channel').val(channelDetails['channel_id'])
    $('#title').append(channelDetails['title'])
    $('#image').attr({ src:'/images/channels/' + channelDetails['channel_id'] + '.jpg' })
    $('#description').append(channelDetails['description'])
    $('#website').append('<a href=\'' + channelDetails['website'] + '\'>' + channelDetails['website'] + '</a>')
    $('#channelDetailsLanguageIcon').attr('src','/images/icons/languages/' + channelDetails['language_idfs'] + '.gif')
    $('#channelDetailsLanguage').append(channelDetails['language'])
    
    var newFeeds = channelDetails['feeds'] - channelDetails['c']
    
    if(newFeeds == channelDetails['feeds']){
        $('.flagAllNew').css({ 'border-color':'#000000', 'color':'#000000' })
        $('.flagAllNew').attr('disabled', 'disabled')
    }else if(newFeeds == '0'){
        $('.flagAllDone').css({ 'border-color':'#000000', 'color':'#000000' })
        $('.flagAllDone').attr('disabled', 'disabled')    
    }
    
    $('#newFeeds').append(newFeeds)
    $('#feeds').append(channelDetails['feeds'])
    if(channelDetails['type_idfs'] == 1 || channelDetails['type_idfs'] == 4){
        $('#channelDetailsTypeIcon').attr('src','/images/icons/video.gif')
        $('#channelDetailsType').append('Video')
    }else{
        $('#channelDetailsTypeIcon').attr('src','/images/icons/audio.gif')
        $('#channelDetailsType').append('Audio')
    }
    $('#type').val(channelDetails['type_idfs'])
})


////////////////////////////////////////////////////////////////////////////////
//
// Channels >  Load Episodes
//
////////////////////////////////////////////////////////////////////////////////

backend.on('loadChannelEpisodes', function(channelEpisodes){  

    var list = '<div class=\'episodesList\'>'
    list += '<div class=\'episode_info_table\'>'

    channelEpisodes = JSON.parse(channelEpisodes)
    for(var i in channelEpisodes){             
        list += '<div class=\'episode_info_row\' >'
        list += '<div class=\'episode_info_cell_left\' >'
        list += '<h3>' + channelEpisodes[i]['title'] + '</h3>'
        var date = new Date(channelEpisodes[i]['date'])
        date = ('0' + date.getDate()).slice(-2) + '.' + date.getMonth()+1 + '.' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)
        list += '<p class=\'episode_meta\'>' + date + ' | ' + channelEpisodes[i]['duration'].toString().toHHMMSS() + '</p>'

        if($('#type').val() == '4'){            
            list += '<img src=\'http://img.youtube.com/vi/' + channelEpisodes[i]['url'] + '/mqdefault.jpg\' />'    
        }
        
        if(channelEpisodes[i]['description']){
            list += '<p class=\'episodeDescription\'>' + channelEpisodes[i]['description'] + '</p>'
        }else{
            list += '<p class=\'episodeDescription\'>No descripion available...</p>'
        }
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

////////////////////////////////////////////////////////////////////////////////
//
// Channels >  Channel Details > Buttons
//
////////////////////////////////////////////////////////////////////////////////

$( document ).ready(function() {
    
    $('.content_box').on('click', '.subscribe', function(){
        $(this).css({ 'border-color':'#FF0000', 'color':'#FF0000' })
        $(this).attr('class', 'unsubscribe')
        $(this).html('Unsubscribe')
        backend.emit('subscribeChannel', readCookie('channel'), readCookie('userId'))

        var channel = '<li id=\'' + readCookie('channel') + '\' class=\'navigationChannel\' >'
        channel += '<img src=\'images/channels/icons/' + readCookie('channel') + '.jpg\' />'
        channel += '<p>' + $('#title').html() + '</p>'
        
        var newFeeds = $('#newFeeds').html()
        if(newFeeds !== '0'){
            channel += '<p id=\'' + readCookie('channel') + '\' class=\'navigationEpisodeCounter\'>' + newFeeds + '</p>'
        }
        
        channel += '</li>'
        $('.navigationLeftUserChannels').append(channel).each(function(){
            $('#' + readCookie('channel') + '.navigationChannel').show(400)
        })
    })
    
    $('.content_box').on('click', '.unsubscribe', function(){
        $(this).css({ 'border-color':'#00FF00', 'color':'#00FF00' })
        $(this).attr('class', 'subscribe')
        $(this).html('Subscribe')
        backend.emit('unsubscribeChannel', readCookie('channel'), readCookie('userId'))
        $('#' + readCookie('channel') + '.navigationChannel').hide(400, function(){
            $(this).remove()
        })
    })
    
    $('.content_box').on('click', '.flagAllDone', function(){
        $(this).css({ 'border-color':'#000000', 'color':'#000000' })
        $(this).attr('disabled', 'disabled')
        $('#' + readCookie('channel') + '.navigationEpisodeCounter').fadeOut('slow')
        backend.emit('flagAllDone', readCookie('channel'), readCookie('userId'))
        $('.flagAllNew').css({ 'border-color':'#ffc438', 'color':'#ffc438' })
        $('.flagAllNew').removeAttr('disabled');
    })
    
    $('.content_box').on('click', '.flagAllNew', function(){
        $(this).css({ 'border-color':'#000000', 'color':'#000000' })
        $(this).attr('disabled', 'disabled')
        $('#' + readCookie('channel') + '.navigationEpisodeCounter').fadeIn('slow')
        backend.emit('flagAllNew', readCookie('channel'), readCookie('userId'))   
        $('.flagAllDone').css({ 'border-color':'#ffc438', 'color':'#ffc438' })
        $('.flagAllDone').removeAttr('disabled');
    })
})






backend.on('getYoutubeUrl', function(yturl){       
    $('#player').attr({ src:yturl }).append(function(){
        var player = document.getElementById('player')
        player.play()
    })
})

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10)
    if(sec_num > '1000000'){
        sec_num = parseInt(this / 6000, 10)
    }    
    //sec_num = sec_num / 6000
    var hours   = Math.floor(sec_num / 3600)
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60)
    var seconds = sec_num - (hours * 3600) - (minutes * 60)

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds
    return time
}
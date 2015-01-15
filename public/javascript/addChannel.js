var settingsChannel = io('/settings')
var backend = io('/backend')


////////////////////////////////////////////////////////////////////////////////
//
// Add New Channel
//
////////////////////////////////////////////////////////////////////////////////

function fetchNewFeed(){
    if($('input[name=feedurl]').val()){
        settingsChannel.emit('fetchFeed', $('input[name=feedurl]').val())
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
                        
            list += '<img src=\'images/channels/' + channelList[i]['_id'] + '.jpg\' width=\'120\' height=\'120\' />'
            list += '<b>' + channelList[i]['title'] + ' <img src=\'images/icons/languages/' + channelList[i]['language'] + '.gif\' height=\'12\' /></b>'
            //list += '<button style=\'height:30px;width:120px;color:#00FF00;border-color:#00FF00;\'>Subscribe</button>'
            list += '</div>'
    }
    list += '</div>'

    $('.content_box').append(list)
})

/*
backend.on('loadChannelList', function(channelList){    
   
    var audiolist = ''
    var videolist = ''

    for(var i in channelList){
        if(channelList[i]['type'] == 'audio_podcast' || channelList[i]['type'] == 'audio_soundcloud'){
            audiolist += '<tr class=\'main_list_entry\' id=\'' + channelList[i]['_id'] + '\'>'
            audiolist += '<td><img src=\'images/channels/icons/' + channelList[i]['_id'] + '.jpg\' width=\'30\' /></td>'
            audiolist += '<td>' + channelList[i]['title'] + '</td>'
            audiolist += '<td>' + channelList[i]['language'] + '</td>'
            audiolist += '<td>' + channelList[i]['feeds'] + '</td>'
            var date = new Date(channelList[i]['update_date'])
            audiolist += '<td>' + date.getDay() + '.' + (date.getMonth()+1) + '.' + date.getFullYear() + '</td>'
            audiolist += '<td><button style=\'height:30px;width:100px;color:#00FF00;border-color:#00FF00;\'>Subscribe</button></td>'
            audiolist += '</tr>'
        }else{
            videolist += '<tr class=\'main_list_entry\' id=\'' + channelList[i]['_id'] + '\'>'
            videolist += '<td><img src=\'images/channels/icons/' + channelList[i]['_id'] + '.jpg\' width=\'30\' /></td>'
            videolist += '<td>' + channelList[i]['title'] + '</td>'
            videolist += '<td>' + channelList[i]['language'] + '</td>'
            videolist += '<td>' + channelList[i]['feeds'] + '</td>'
            var date = new Date(channelList[i]['update_date'])
            videolist += '<td>' + date.getDay() + '.' + (date.getMonth()+1) + '.' + date.getFullYear() + '</td>'
            videolist += '<td><button style=\'height:30px;width:100px;color:#00FF00;border-color:#00FF00;\'>Subscribe</button></td>'
            videolist += '</tr>'
        }
    }
    
    var list = ''
    list += '<h2>Video Channels</h2>'
    list += '<div class=\'main_list_box\'>'
    list += '<table width=\'100%\' cellspacing=\'0\' cellpadding=\'0\'>'
    list += '<tr>'
    list += '<td width=\'40\'><b>Icon</b></td>'
    list += '<td><b>Title</b></td>'
    list += '<td width=\'90\'><b>Language</b></td>'
    list += '<td width=\'80\'><b>Episodes</b></td>'
    list += '<td width=\'100\'><b>Last Update</b></td>'
    list += '<td width=\'100\'><b>Subscription</b></td>'
    list += '</tr>'
    list += videolist
    list += '</table>'
    list += '</div>'
    
    list += '<br/><h2>Audio Channels</h2>'
    list += '<div class=\'main_list_box\'>'
    list += '<table width=\'100%\' cellspacing=\'0\' cellpadding=\'0\'>'
    list += '<tr>'
    list += '<td width=\'40\'><b>Icon</b></td>'
    list += '<td><b>Title</b></td>'
    list += '<td width=\'90\'><b>Language</b></td>'
    list += '<td width=\'80\'><b>Episodes</b></td>'
    list += '<td width=\'100\'><b>Last Update</b></td>'
    list += '<td width=\'100\'><b>Subscription</b></td>'
    list += '</tr>'
    list += audiolist
    list += '</table>'
    list += '</div>'

    $('.content_box').append(list)
})
*/

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
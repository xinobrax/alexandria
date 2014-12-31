var settingsChannel = io('/settings')
var backend = io('/backend')

settingsChannel.on('fetchFeed', function(feed){    
    $('input[name=title]').val(feed.title)
    $('textarea[name=description]').val(feed.description)
    $('input[name=website]').val(feed.website)
    $('input[name=image]').val(feed.image)
})

function fetchNewFeed(){
    if($('input[name=feedurl]').val())
        settingsChannel.emit('fetchFeed', $('input[name=feedurl]').val())
}

////////////////////////////////////////////////////////////////////////////////
//
//
//
////////////////////////////////////////////////////////////////////////////////

function addChannel(){
    var channel = {
            title: $('input[name=title]').val(),
            type: $('select[name=type]').val(),
            description: $('textarea[name=description]').val(),
            website: $('input[name=website]').val(),
            feed: $('input[name=feedurl]').val(),
            image: $('input[name=image]').val(),
            feeds: 0,
            filter: $('input[name=filter]').val(),
            language: $('select[name=language]').val(),
            update_date: new Date(),        
    }
    
    settingsChannel.emit('addChannel', channel)
}

function loadChannelList(){
    backend.emit('loadChannelList', '')
}

backend.on('loadChannelList', function(channelList){    
   
    var list = '<div class=\'main_list_box\'>'
    list += '<table width=\'100%\' cellspacing=\'0\' cellpadding=\'0\'>'
    list += '<tr>'
    list += '<td width=\'40\'><b>Icon</b></td>'
    list += '<td><b>Title</b></td>'
    list += '<td width=\'90\'><b>Language</b></td>'
    list += '<td width=\'80\'><b>Episodes</b></td>'
    list += '<td width=\'100\'><b>Last Update</b></td>'
    list += '<td width=\'100\'><b>Subscription</b></td>'
    list += '</tr>'
            
    for(var i in channelList){            
        list += '<tr class=\'main_list_entry\' id=\'' + channelList[i]['_id'] + '\'>'
        list += '<td><img src=\'images/channels/icons/' + channelList[i]['_id'] + '.jpg\' width=\'30\' /></td>'
        list += '<td>' + channelList[i]['title'] + '</td>'
        list += '<td>' + channelList[i]['language'] + '</td>'
        list += '<td>' + channelList[i]['feeds'] + '</td>'
        var date = new Date(channelList[i]['update_date'])
        list += '<td>' + date.getDay() + '.' + (date.getMonth()+1) + '.' + date.getFullYear() + '</td>'
        
        list += '<td>Subscribe</td>'
        list += '</tr>'
    }  
    
    list += '</table>'
    list += '</div>'
    
    
    $('.content_box').append(list)
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
    $('#update').append(channelList['update_date'])
})

backend.on('loadChannelEpisodes', function(channelEpisodes){  
    
    var list = '<div class=\'episodesList\'>'
    list += '<div class=\'episode_info_table\'>'
    
    for(var i in channelEpisodes){            
        list += '<div class=\'episode_info_row\' >'
        list += '<div class=\'episode_info_cell_left\' >'
      
        list += '<h3>' + channelEpisodes[i]['title'] + '</h3>'
        var date = new Date(channelEpisodes[i]['date'])
        list += '<p class=\'episode_meta\'>' + date.getDay() + '.' + (date.getMonth()+1) + '.' + date.getFullYear() + ' | ' + channelEpisodes[i]['duration'] + '</p>'                
        list += '<p>' + channelEpisodes[i]['description'] + '</p>'        
        
        list += '</div>'
        
        list += '<div class=\'episode_info_cell_right\' ><br/>'
        list += '<font class=\'episode_play_now\' id=\'' + channelEpisodes[i]['url'] + '\'><img src=\'images/icons/play.png\' height=\'14\' /> Play now</font><br/>'
        list += '<font class=\'episode_play_later\'><img src=\'images/icons/play_later.png\' height=\'14\' /> Play later</font><br/>'
        list += '<font class=\'episode_download\' id=\'' + channelEpisodes[i]['url'] + '\' ><img src=\'images/icons/download.png\' height=\'14\' /> Download</font>'
        list += '</div>'
        list += '</div>'
        /*
        list += '<div class=\'episode_info_row_space\' >&nbsp;'
        list += '</div>'
        */
    }  
    list += '</div>'
    list += '</div><br/><br/>'
    
    
    $('.content_box').append(list).append(function(){        
        //alert('1')
        $('.episodesList').niceScroll({cursorcolor:'#ffc438', cursorwidth:'10px', cursoropacitymin:'0.6', background:'#584b2e', cursorborder:'0px'})
        //$('.episodesList').html('sdsa')
        //alert('2')
    })
})


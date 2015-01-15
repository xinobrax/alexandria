$( document ).ready(function() {
        
    //$('.content_box').niceScroll({cursorcolor:'#ffc438', cursorwidth:'10px', cursoropacitymin:'0.2', cursorborder:'0px'})
    
    $('#field').focus()
    $('.content_box').fadeIn(1400)       
    $('.channels').animate({ width: 260}, 1000)
    $('.connections').animate({ width: 260}, 1000, function(){        
        $('.channels_parent').fadeIn(1000)   
        $('.navigationChannel').fadeIn(1000, function(){
            $('header img').show(1000)
            $('.chatBox').animate({ height: 24}, 1000)           
        })     
        $('.navigationRoom').fadeIn(1000)
        $('.navigationPlaylistBox').fadeIn(1000)
        $('.player').fadeIn(1000)
        
        $('header').animate({ height: 39}, 1000)
        $('.chatBoxContainer').animate({ height: 30}, 1000)
    })

    //$('.chat_box_text').perfectScrollbar()
    
    ////////////////////////////////////////////////////////////////////////////////
    //
    // Top Navigation > Menue
    //
    //////////////////////////////////////////////////////////////////////////////// 
    
    $('header img').click(function(){        
        if($('.topNavigation').css('height') < '10'){
            $('.topNavigation').show()
            $('.topNavigation').animate({ height:'128' })
            $('.topNavigationEntry').show()    
        }else{            
            $('.topNavigationEntry').hide()  
            $('.topNavigation').animate({ height:'0' }, function(){
                $('.topNavigation').hide()
            })            
        }        
    })
    
    $('.topNavigationEntry').click(function(){
        var site = $(this).attr('id')
        switch(site){
            case 'profileSettings':                
                $('.content_box').load('/forms/editProfile.html', function(){
                    loadProfile()
                })
                break
            case 'browseChannels':   
                $('.content_box').load('/pages/browseChannels.html', function(){
                    loadChannelList()
                })
                break
            case 'browseRooms':   
                $('.content_box').load('/pages/browseRooms.html', function(){
                    loadRoomList()
                })
                break
            case 'logout':                
                break
        }   
        
        $('.topNavigationEntry').hide()  
        $('.topNavigation').animate({ height:'0' }, function(){
            $('.topNavigation').hide()
        }) 
    })       
    
    
    ////////////////////////////////////////////////////////////////////////////////
    //
    // Navigation > Channels > My Channels
    //
    //////////////////////////////////////////////////////////////////////////////// 
    
    $('.navigationChannel').click(function(){

        $('.content_box').load('/pages/myChannels.html', function(){
            //loadChannelList()
        })
    })
    
    
    ////////////////////////////////////////////////////////////////////////////////
    //
    // Navigation > Rooms > Room
    //
    //////////////////////////////////////////////////////////////////////////////// 
    
    $('.navigationRoom').click(function(){
        var room = $(this).attr('id')
        $('.content_box').load('/pages/chatWindow.html', function(){            
            loadChatWindow(room)
            $('.chatWindowInputField').focus()
            $('#' + room + '.navigationMessageCounter').fadeOut('slow', function(){
                $('#' + room + '.navigationMessageCounter').html('0')
            })
            $('.chatWindowMessages').niceScroll({cursorcolor:'#ffc438', cursorwidth:'10px', cursoropacitymin:'0.6', background:'#584b2e', cursorborder:'0px'})
        })
    })    
        
    
    ////////////////////////////////////////////////////////////////////////////////
    //
    // Channels > Channel Details
    //
    //////////////////////////////////////////////////////////////////////////////// 
    
    $('.content_box').on('click', '.browseChannelsChannelBox', function() {
    var channelId = $(this).attr('id')
        $('.content_box').load('/pages/channelDetails.html', function(){
            loadChannelDetails(channelId)
        })
    })    
    
    
    ////////////////////////////////////////////////////////////////////////////////
    //
    // Channels > Channel Details > Episodes
    //
    ////////////////////////////////////////////////////////////////////////////////    
    
    $('.content_box').on('click', '.episode_play_now', function(){
        if($('#type').val() == 'video_youtube'){
            var backend = io('/backend')
            backend.emit('getYoutubeUrl', $(this).attr('id'))
        }else if($('#type').val() == 'audio_podcast' || $('#type').val() == 'video_podcast'){
            $('#player').attr({ src:$(this).attr('id'), poster:$('#image').attr('src') }).append(function(){
                var player = document.getElementById('player')
                player.play()
            })
        }
    })
    
    $('.content_box').on('click', '.episode_download', function(){
        window.location.href = $(this).attr('id')
    })
         
    
    ////////////////////////////////////////////////////////////////////////////////
    //
    // Admin Settings > Channels > Add new Channel
    //
    ////////////////////////////////////////////////////////////////////////////////
    
    $('.content_box').load('/forms/addChannel.html')
    //$('.content_box').load('/pages/todo.html')
    //$('.content_box').load('/pages/browseChannels.html')
    /*
    $('.content_box').load('/forms/addRoom.html', function(){
        var backend = io('/backend')
        backend.emit('getRoomTree')
    })
    */
    
    
    
    $('.content_box').on('click', 'button[name=addChannel]', function(){
        addChannel()
    })

    
    ////////////////////////////////////////////////////////////////////////////////
    //
    // (New) Chat
    //
    ////////////////////////////////////////////////////////////////////////////////
    
    var socket = io('/root')
    
    socket.on('setUserlist', function(userlist){              
        var list = ''
        for(username in userlist){            
            list += '<li class=\'navigationChannel\' ><img src=\'http://cropfm.at/cropfm_icons/cropfm_rss_channel_logo.jpg\' /><p>' + userlist[username] + '</p></li>'  
        }   
        $('.left_space').html(list).append(function(){
            //$('.left_space').children('.navigationChannel').fadeIn(400)
        })        
    })  
    
    socket.on('chatMessage', function(msg){
        if($('#user').val() == msg.username){
            var message = '<div style=\'position:relative;width:100%;text-align:right;clear:right;\'>'
            message += '<font style=\'background-color:#212121;padding:6px;margin:2px;margin-right:14px;text-shadow: 1px 1px 1px black;border-radius:9px;float:right;\'>'
        }else{
            var message = '<div style=\'position:relative;width:190px;min-height:30px;clear:left;\'>'
            message += '<font style=\'background-color:#212121;padding:6px;margin:2px;text-shadow: 1px 1px 1px black;border-radius:9px;float:left;\'>'
            message += '<img style=\'padding-right:4px;float:left\' src=\'http://0.gravatar.com/avatar/c555b3f0b5564bde0eb15bf95f9c6b81?s=64&d=blank&r=X\' width=\'30\' /> '
        }
        
        message += msg['message']
        message += '</font>'
        message += '</div><br/>'                            
            
        $('#chatBoxAlexandria').append(message)     
        $('#chatBoxAlexandria').animate({ scrollTop: $('#chatBoxAlexandria')[0].scrollHeight}, 400)
    })
    
    $('.chat_box_header').click(function(){
        if($(this).parent('.chatBox').css('height') == '24px'){
            $(this).css( 'background-image', 'none')
            $(this).css( 'background', '#c68b01')
            $(this).children().children('.closeChatBoxIcon').attr({ src:'images/icons/close_a.png' })
            $(this).children().children('.maximizeChatBoxIcon').attr({ src:'images/icons/maximize_a.png' })
            $(this).children().children('.chatSettingsIcon').attr({ src:'images/icons/settings_a.png' })

            $(this).parent('.chatBox').children('.chat_box_text').css( 'height', '100%')
            $(this).parent('.chatBox').children('.chat_box_input').animate({ height:'22px', paddingTop:'8px' })
            $(this).parent('.chatBox').animate({ height:'230px' }, function(){
                $(this).animate({ bottom:'54px' })
                $(this).children('.chat_box_input').focus()
            })                                 
        }else{
            $(this).css( 'background', 'none')
            $(this).css( 'background-image', 'url(images/box_bg_orange_dark.png)')       
            $(this).parent('.chatBox').children('.chat_box_input').animate({ height:'0px', paddingTop:'0px' })           
            $(this).parent('.chatBox').animate({ bottom:'0px' }, function(){
                $(this).animate({ height:'24px' })
            })
            $(this).children().children('.closeChatBoxIcon').attr({ src:'images/icons/close.png' })
            $(this).children().children('.maximizeChatBoxIcon').attr({ src:'images/icons/maximize.png' })
            $(this).children().children('.chatSettingsIcon').attr({ src:'images/icons/settings.png' })           
        }        
    })    
    
    $('.chat_box_input').keyup(function(e) {
        if(e.keyCode == 13) {            
            var date = ('0' + new Date().getHours()).slice(-2) + ':' + ('0' + new Date().getMinutes()).slice(-2) + ':' + ('0' + new Date().getSeconds()).slice(-2)
            var message = { timestamp: date, message: $(this).val(), color: '00ff00' }
            socket.emit('chatmessage', message)            
            $(this).val('')            
        }
    })
    
})




String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}
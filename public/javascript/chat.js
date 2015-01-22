var chatSpace = io('/root')


////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////

function loadChatWindow(room){
    chatSpace.emit('joinRoom', room)
    chatSpace.emit('getRoomHistory', room)
    $('#room').val(room)
}



$( document ).ready(function() {
    

////////////////////////////////////////////////////////////////////////////////
//
// Chat > Post Message (Enter)
//
////////////////////////////////////////////////////////////////////////////////
    
    $('.content_box').on('keyup', '.chatWindowInputField', function(e) {
                
        if(e.keyCode == 13) {            
            var value = $(this).val()
            value = value.length + value.replace(/[^\n]/g, '').length
            if(value > 2){
                var date = ("0" + new Date().getHours()).slice(-2) + ':' + ("0" + new Date().getMinutes()).slice(-2) + ':' + ("0" + new Date().getSeconds()).slice(-2)
                var message = { timestamp:date, user_idfs:$('#userId').val(), room_idfs:$('#room').val(), message:$('.chatWindowInputField').val() }

                chatSpace.emit('chatMessage', message)

                $(this).val('')
                //$('.chatWindowMessages').animate({ scrollTop: $('.chatWindowMessages')[0].scrollHeight}, 400)            
            }
            $(this).val('')
        }
    })

    
////////////////////////////////////////////////////////////////////////////////
//
// Chat > Post Message (Button)
//
////////////////////////////////////////////////////////////////////////////////
    
    $('.content_box').on('click', '.chatWindowSendButton', function(){
        
        if($('.chatWindowInputField').val() !== ''){
            var date = ("0" + new Date().getHours()).slice(-2) + ':' + ("0" + new Date().getMinutes()).slice(-2) + ':' + ("0" + new Date().getSeconds()).slice(-2)
            var message = { timestamp:date, user_idfs:$('#userId').val(), room_idfs:$('#room').val(), message:$('.chatWindowInputField').val() }

            chatSpace.emit('chatMessage', message)

            $(this).parent('.chatWindowSendButtonDiv').parent('.chatWindowInput').children('.chatWindowInputFieldDiv').children('.chatWindowInputField').val('')
            //$('.chatWindowMessages').animate({ scrollTop: $('.chatWindowMessages')[0].scrollHeight}, 400)
        }
        $(this).parent().prev().children().focus()
    })
})

    
////////////////////////////////////////////////////////////////////////////////
//
// Chat > Receive Message
//
////////////////////////////////////////////////////////////////////////////////

chatSpace.on('chatMessage', function(msg){

    var message = ''
    message += '<div class=\'chatWindowPost\'>'
    if(msg.user_idfs == $('#userId').val()){
        
        message += '<div class=\'chatWindowPostMessageBox\' style=\'text-align:right;\'>'
        message += '<div class=\'chatWindowPostMessage\'>'
        //message += '<font style=\'font-weight:bold;\'>'
        //message += msg.username + ' [' + msg.timestamp + ']'
        //message += '</font><br/>'
        message += msg.message
        message += '</div>'
        message += '</div>'
        
        message += '<div class=\'chatWindowPostUserBox\'>'
        message += '<div class=\'chatWindowPostUser\'>'
        message += '<img src=\'images/users/avatars/' + msg.user_idfs + '.jpg\' />'
        message += '</div>'
        message += '</div>'
    }else{
        message += '<div class=\'chatWindowPostUserBox\'>'
        message += '<div class=\'chatWindowPostUser\'>'
        message += '<img src=\'images/users/avatars/' + msg.user_idfs + '.jpg\' />'
        message += '</div>'
        message += '</div>'
        
        message += '<div class=\'chatWindowPostMessageBox\'>'
        message += '<div class=\'chatWindowPostMessage\'>'
        message += '<font style=\';font-weight:bold;\'>'
        message += '[' + msg.timestamp + '] ' + msg.username
        message += '</font><br/>'
        message += msg.message
        message += '</div>'
        message += '</div>'
    }
    message += '</div>'

    if(msg.room_idfs == $('#room').val()){
        $('.chatWindowTable').append(message).each(function(){
            $('.chatWindowPost').show(400)
            
        })
        $('.chatWindowMessages').getNiceScroll().doScrollPos(0,$('.chatWindowMessages').last().position().bottom)
        $('.chatWindowMessages').animate({ scrollTop: $('.chatWindowMessages')[0].scrollHeight}, 400)
        
    }else{
        var messageCounter = $('#' + msg.room_idfs + '.navigationMessageCounter').html()
        messageCounter++
        if(messageCounter == '1'){
            $('#' + msg.room_idfs + '.navigationMessageCounter').fadeIn('slow')
        }
        $('#' + msg.room_idfs + '.navigationMessageCounter').html(messageCounter)
        
        // TODO Chat Box Highlight
    }    
})


////////////////////////////////////////////////////////////////////////////////
//
// Chat > Receive Room History
//
////////////////////////////////////////////////////////////////////////////////

chatSpace.on('getRoomHistory', function(roomHistory){
    
    
    roomHistory = JSON.parse(roomHistory)
    $('.content_box').children('h1').html(roomHistory.title)
    $('.content_box').children('#chatWindowRoomIcon').attr({ src:'images/rooms/icons/' + roomHistory.room_id + '.gif' })
    for(var i in roomHistory.messages){
        
        var message = ''
        message += '<div class=\'chatWindowPost\'>'
        if(roomHistory.messages[i]['user_idfs'] == $('#userId').val()){
            
            message += '<div class=\'chatWindowPostMessageBox\' style=\'text-align:right;\'>'
            message += '<div class=\'chatWindowPostMessage\'>'
            //message += '<font style=\'font-weight:bold;\'>'
            //message += roomHistory.messages[i].user['username'] + ' [' + roomHistory.messages[i]['timestamp'] + ']'
            //message += '</font><br/>'
            message += '<p style=\'margin:0px;margin-top:4px;\'>' + roomHistory.messages[i]['message'] + '</p>'
            message += '</div>'
            message += '</div>'
            
            message += '<div class=\'chatWindowPostUserBox\'>'
            message += '<div class=\'chatWindowPostUser\'>'
            message += '<img src=\'images/users/avatars/' + roomHistory.messages[i]['user_idfs'] + '.jpg\' />'
            message += '</div>'
            message += '</div>'
        }else{
            message += '<div class=\'chatWindowPostUserBox\'>'
            message += '<div class=\'chatWindowPostUser\'>'
            message += '<img src=\'images/users/avatars/' + roomHistory.messages[i]['user_idfs'] + '.jpg\' />'
            message += '</div>'
            message += '</div>'
            
            message += '<div class=\'chatWindowPostMessageBox\'>'
            message += '<div class=\'chatWindowPostMessage\'>'
            message += '<font style=\';font-weight:bold;\'>'
            message += '[' + roomHistory.messages[i]['timestamp'] + '] ' + roomHistory.messages[i].user['username']
            message += '</font><br/>'
            message += '<p style=\'margin:0px;margin-top:4px;\'>' + roomHistory.messages[i]['message'] + '</p>'
            message += '</div>'
            message += '</div>'            
        }
        message += '</div>'
        $('.chatWindowTable').append(message)        
    }   
    $(".chatWindowMessages").scrollTop($(".chatWindowMessages")[0].scrollHeight)
})
var chatSpace = io('/root')


////////////////////////////////////////////////////////////////////////////////
//
// 
//
////////////////////////////////////////////////////////////////////////////////

function loadChatWindow(room){
    chatSpace.emit('joinRoom', room)
    chatSpace.emit('getRoomHistory', room)
    
    $('.content_box').children('h1').html(room)
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
            var date = ("0" + new Date().getHours()).slice(-2) + ':' + ("0" + new Date().getMinutes()).slice(-2) + ':' + ("0" + new Date().getSeconds()).slice(-2)
            var message = { timestamp:date, user:$('#user').val(), room:$('#room').val(), message:$('.chatWindowInputField').val(), color:'00ff00' }

            chatSpace.emit('chatMessage', message)

            $(this).val('')
            $('.chatWindowMessages').perfectScrollbar('update')
            $(".chatWindowMessages").animate({ scrollTop: $("#messages")[0].scrollHeight}, 400)            
        }
    })

    
////////////////////////////////////////////////////////////////////////////////
//
// Chat > Post Message (Button)
//
////////////////////////////////////////////////////////////////////////////////
    
    $('.content_box').on('click', '.chatWindowSendButton', function(){
        
        var date = ("0" + new Date().getHours()).slice(-2) + ':' + ("0" + new Date().getMinutes()).slice(-2) + ':' + ("0" + new Date().getSeconds()).slice(-2)
        var message = { timestamp:date, user:$('#user').val(), room:$('#room').val(), message:$('.chatWindowInputField').val(), color:'00ff00' }
        
        $(this).parent().prev().children().focus()
        
        chatSpace.emit('chatMessage', message)
        
        $(this).parent('.chatWindowSendButtonDiv').parent('.chatWindowInput').children('.chatWindowInputFieldDiv').children('.chatWindowInputField').val('')
        $('.chatWindowMessages').perfectScrollbar('update')
        $(".chatWindowMessages").animate({ scrollTop: $("#messages")[0].scrollHeight}, 400)

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
    if(msg.user == $('#user').val()){
        
        message += '<div class=\'chatWindowPostMessageBox\' style=\'text-align:right;\'>'
        message += '<div class=\'chatWindowPostMessage\'>'
        message += '<font style=\'color:#' + msg.color + ';font-weight:bold;\'>'
        message += msg.user + ' [' + msg.timestamp + ']'
        message += '</font><br/>'
        message += msg.message
        message += '</div>'
        message += '</div>'
        
        message += '<div class=\'chatWindowPostUserBox\'>'
        message += '<div class=\'chatWindowPostUser\'>'
        message += '<img src=\'http://0.gravatar.com/avatar/c555b3f0b5564bde0eb15bf95f9c6b81?s=64&d=blank&r=X\' />'
        message += '</div>'
        message += '</div>'
    }else{
        message += '<div class=\'chatWindowPostUserBox\'>'
        message += '<div class=\'chatWindowPostUser\'>'
        message += '<img src=\'http://0.gravatar.com/avatar/c555b3f0b5564bde0eb15bf95f9c6b81?s=64&d=blank&r=X\' />'
        message += '</div>'
        message += '</div>'
        
        message += '<div class=\'chatWindowPostMessageBox\'>'
        message += '<div class=\'chatWindowPostMessage\'>'
        message += '<font style=\'color:#' + msg.color + ';font-weight:bold;\'>'
        message += '[' + msg.timestamp + '] ' + msg.user
        message += '</font><br/>'
        message += msg.message
        message += '</div>'
        message += '</div>'
    }
    message += '</div>'

    if(msg.room == $('#room').val()){
        $('.chatWindowTable').append(message).each(function(){
            $('.chatWindowPost').show(400)
        })

        $('.chatWindowMessages').perfectScrollbar('update')        
        $(".chatWindowMessages").animate({ scrollTop: $(".chatWindowMessages")[0].scrollHeight}, 400)
    }else{
        var messageCounter = $('#' + msg.room + '.navigationMessageCounter').html()
        messageCounter++
        if(messageCounter == '1'){
            $('#' + msg.room + '.navigationMessageCounter').fadeIn('slow')
        }
        $('#' + msg.room + '.navigationMessageCounter').html(messageCounter)
        
        // TODO Chat Box Highlight
    }    
})


////////////////////////////////////////////////////////////////////////////////
//
// Chat > Receive Room History
//
////////////////////////////////////////////////////////////////////////////////

chatSpace.on('getRoomHistory', function(roomHistory){
    
    for(var i in roomHistory){            

        var message = ''
        message += '<div class=\'chatWindowPost\'>'
        if(roomHistory[i]['user'] == $('#user').val()){
            
            message += '<div class=\'chatWindowPostMessageBox\' style=\'text-align:right;\'>'
            message += '<div class=\'chatWindowPostMessage\'>'
            message += '<font style=\'color:#' + roomHistory[i]['color'] + ';font-weight:bold;\'>'
            var date = new Date(roomHistory[i]['date'])
            date = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2)
            message += roomHistory[i]['user'] + ' [' + date + ']'
            message += '</font><br/>'
            message += '<p style=\'margin:0px;margin-top:4px;\'>' + roomHistory[i]['message'] + '</p>'
            message += '</div>'
            message += '</div>'
            
            message += '<div class=\'chatWindowPostUserBox\'>'
            message += '<div class=\'chatWindowPostUser\'>'
            message += '<img src=\'http://0.gravatar.com/avatar/c555b3f0b5564bde0eb15bf95f9c6b81?s=64&d=blank&r=X\' />'
            message += '</div>'
            message += '</div>'
        }else{
            message += '<div class=\'chatWindowPostUserBox\'>'
            message += '<div class=\'chatWindowPostUser\'>'
            message += '<img src=\'http://0.gravatar.com/avatar/c555b3f0b5564bde0eb15bf95f9c6b81?s=64&d=blank&r=X\' />'
            message += '</div>'
            message += '</div>'
            
            message += '<div class=\'chatWindowPostMessageBox\'>'
            message += '<div class=\'chatWindowPostMessage\'>'
            message += '<font style=\'color:#' + roomHistory[i]['color'] + ';font-weight:bold;\'>'
            var date = new Date(roomHistory[i]['date'])
            date = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2)
            message += '[' + date + '] ' + roomHistory[i]['user']
            message += '</font><br/>'
            message += '<p style=\'margin:0px;margin-top:4px;\'>' + roomHistory[i]['message'] + '</p>'
            message += '</div>'
            message += '</div>'
            
        }
        message += '</div>'
        
        $('.chatWindowTable').append(message)        
    }   
    $(".chatWindowMessages").scrollTop($(".chatWindowMessages")[0].scrollHeight)
})
var backend = io('/backend')

function loadRoomList(){
    backend.emit('getRoomList')    
}


$(document).ready(function() {
    

    
    backend.on('getRoomTree', function(rooms){  

        rooms.forEach(function(entry){
            
            if(entry['parents'].indexOf('root') !== -1){
                var title = entry['title']
                var entry = '<div class=\'roomTreeEntry\'><input type=\'checkbox\' name=\'parents\' value=\'' + title + '\'> ' + title + '</div>' 
                
                rooms.forEach(function(subEntry){
                    
                    if(subEntry['parents'].indexOf(title) !== -1){
                        entry += '<div class=\'roomTreeEntry\' style=\'margin-left:30px;\'>'
                        entry += '<input type=\'checkbox\' name=\'parents\' value=\'' + subEntry['title'] + '\'> ' + subEntry['title']
                        entry += '</div>' 
                    }
                })
                
                $('.roomTree').append(entry)
            }
        })
    })
    
    backend.on('getRoomList', function(rooms){  

        rooms.forEach(function(entry){
            
            if(entry['parents'].indexOf('root') !== -1){
                var title = entry['title']
                var entry = '<div class=\'browseRoomsListRow\'>'
                entry += '<div class=\'browseRoomsListEntry\' style=\'width:50px;\'><img src=\'http://coinmarketcap.com/static/img/coins/16x16/bitcoin.png\' /></div>'
                entry += '<div class=\'browseRoomsListEntry\'><h3>' + title + '</h3></div>'
                entry += '<div class=\'browseRoomsListEntry\'>Channels</div>'
                entry += '<div class=\'browseRoomsListEntry\'>Users</div>'
                entry += '<div class=\'browseRoomsListEntry\' style=\'width:50px;right:0px;\'>Join</div>'
                entry += '</div>'
                //var entry = '<div class=\'roomTreeEntry\'><input type=\'checkbox\' name=\'parents\' value=\'' + title + '\'> ' + title + '</div>' 
                
                rooms.forEach(function(subEntry){
                    
                    if(subEntry['parents'].indexOf(title) !== -1){
                        entry += '<div class=\'browseRoomsListRow\'>'
                        entry += '<div class=\'browseRoomsListEntry\' style=\'width:50px;\'><img src=\'http://coinmarketcap.com/static/img/coins/16x16/bitcoin.png\' /></div>'
                        entry += '<div class=\'browseRoomsListEntry\'><b> └── ' + subEntry['title'] + '</b></div>'
                        entry += '<div class=\'browseRoomsListEntry\'>Channels</div>'
                        entry += '<div class=\'browseRoomsListEntry\'>Users</div>'
                        entry += '<div class=\'browseRoomsListEntry\' style=\'width:50px;right:0px;\'>Join</div>'
                        entry += '</div>'
                    }
                })
                entry += '<div class=\'browseRoomsListRow\'>'
                entry += '</div>'
                
                $('.roomList').append(entry)
            }
        })
    })
        
    $('.content_box').on('click', 'button[name=addRoom]', function(){
        
        var parents = []
        $('input[name=parents]:checked').each(function(){
            parents.push($(this).val())
        })

        var room = {
            title: $('input[name=title]').val(),
            description: '',
            parents: parents
        }

        backend.emit('addRoom', room)
    })
    
})


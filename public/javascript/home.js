var backend = io('/backend')

function getUrl(text){
    //var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
    //var urlRegex=/\b((?:[a-z][\w-]+:(?:\/*)|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/|)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;
    var urlRegex=/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
    return text.match(urlRegex, function(url){
        return(url)
    }) 
}

$( document ).ready(function() {
    
    $('.contentBox').on('keyup', '.homeNewPostTextarea', function(e) {
        if (e.keyCode == 32) {
            var url = getUrl($('.homeNewPostTextarea').val())
            var sub = url[0].substr(0, 4)
            
            if(url[0].substr(0, 4) == 'http'){
                url = url[0] 
            }else if(url[0].substr(0, 3) == 'www'){
                url = 'http://' + url[0]    
            }else{
                url = 'http://www.' + url[0]
            }
            
            if(url){
                backend.emit('newPostGetUrlMeta', url)
            }
        }
        
        var rows = document.querySelector('.homeNewPostTextarea').value.split("\n").length
        
            $(this).attr('rows', rows)
            //alert(rows)
        
        
    })
    
    $('.contentBox').on('click', '.homeNewPostUrlMetaClose', function(){
        $('.homeNewPostUrlMetaBox').hide(400)    
    })
    
    $('.contentBox').on('click', '.homeNewPostSend', function(){
    })
    
    backend.on('newPostGetUrlMeta', function(title, images, description, url){
        if(images[0]){
            $('.homeNewPostUrlMetaBox').children('.homeNewPostUrlMetaImage').attr('src', images[0])
        }
        $('.homeNewPostUrlMetaBox').children('h1').html(title)
        $('.homeNewPostUrlMetaBox').children('font').html(url)
        $('.homeNewPostUrlMetaBox').children('p').html(description + '...')
        $('.homeNewPostUrlMetaBox').show(400)
    })
})
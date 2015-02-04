var backend = io('/backend')

function getUrl(text){
    //var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
    //var urlRegex=/\b((?:[a-z][\w-]+:(?:\/*)|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/|)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;
    var urlRegex=/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
    return text.match(urlRegex, function(url){
        return(url)
    }) 
}

function loadPosts(){
    backend.emit('getPosts', readCookie('userId'))
}

$( document ).ready(function() {
      
    backend.on('getPosts', function(posts){
        posts = JSON.parse(posts)
        for(var i in posts){
            
            var post = ''
            post += '<div class=\'postMainBox\'>'
            if(posts[i].isChannel){
                post += '<img id=\'' + posts[i].channel_id + '\' class=\'postAvatar\' src=\'images/channels/icons/' + posts[i].channel_id + '.jpg\' width=\'40\' />'
                post += '<h1 id=\'' + posts[i].channel_id + '\' class=\'postPoster\'>' + posts[i].channel + '</h1>'
            }else{
                post += '<img id=\'' + posts[i].user_id + '\' class=\'postAvatar\' src=\'images/users/avatars/' + posts[i].user_id + '.jpg\' width=\'40\' />'
                post += '<h1 id=\'' + posts[i].user_id + '\' class=\'postPoster\'>' + posts[i].username + '</h1>'
            }
            
            post += '<p class=\'postTime\'>' + posts[i].timestamp + '</p>'
            post += '<p class=\'postText\'>' + posts[i].text + '</p>'
            post += '<font class=\'postActions\'>Like</font> | '
            post += '<font class=\'postActions\'>Dislike</font> | '
            post += '<font class=\'postActions\'>Share</font>'
            post += '</div>'
            
            post += '<div class=\'postAnswersBox\'>'
            post += '<div class=\'postNewAnswersBox\'>'
            post += '<div class=\'postNewAnswersAvatarBox\'>'
            post += '<img class=\'postNewAnswersAvatar\' src=\'images/users/avatars/' + readCookie('userId') + '.jpg\' />'
            post += '</div>'
            post += '<div class=\'postNewAnswerTextareaBox\'>'
            post += '<textarea class=\'postNewAnswerTextarea\'></textarea>'
            post += '</div>'
            post += '</div>'
            post += '</div>'
            $('.postContainer').append(post).each(function(){
                $('.homeScrollContainer').niceScroll({cursorcolor:'#ffc438', cursorwidth:'10px', cursoropacitymin:'0.8', background:'none', cursorborder:'0px'})
            })
        }
    })
    
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
        var post = { 
            user_idfs:readCookie('userId'), 
            text:$('.homeNewPostTextarea').val(), 
            link_image:$('.homeNewPostUrlMetaImage').attr('src'), 
            link_title:$('.homeNewPostUrlMetaTitle').html(), 
            link_description:$('.homeNewPostUrlMetaDescription').html(), 
            link_url:$('.homeNewPostUrlMetaUrl').html(), 
            timestamp:new Date() 
        }
        
        $('.homeNewPostTextarea').val('')
        $('.homeNewPostUrlMetaBox').hide(400)
        $('.homeNewPostUrlMetaImage').attr('src','') 
        $('.homeNewPostUrlMetaTitle').html('')
        $('.homeNewPostUrlMetaDescription').html('')
        $('.homeNewPostUrlMetaUrl').html('') 
    
        backend.emit('newPost', post)  

        var newPost = ''
        newPost += '<div class=\'postMainBox\' style=\'display:none;\'>'
        newPost += '<img id=\'' + readCookie('userId') + '\' class=\'postAvatar\' src=\'images/users/avatars/' + readCookie('userId') + '.jpg\' width=\'40\' />'
        newPost += '<h1 id=\'' + readCookie('userId') + '\' class=\'postPoster\' >' + readCookie('username') + '</h1>'  
        newPost += '<font class=\'postTime\'>' + post.timestamp + '</font>'
        newPost += '<p>' + post.text + '</p>'
        newPost += '<font class=\'postActions\'>Like</font> | '
        newPost += '<font class=\'postActions\'>Dislike</font> | '
        newPost += '<font class=\'postActions\'>Share</font>'
        newPost += '</div>'

        newPost += '<div class=\'postAnswersBox\'>'
        newPost += '<div class=\'postNewAnswersBox\'>'
        newPost += '<div class=\'postNewAnswersAvatarBox\'>'
        newPost += '<img class=\'postNewAnswersAvatar\' src=\'images/users/avatars/' + readCookie('userId') + '.jpg\' />'
        newPost += '</div>'
        newPost += '<div class=\'postNewAnswerTextareaBox\'>'
        newPost += '<textarea class=\'postNewAnswerTextarea\'></textarea>'
        newPost += '</div>'
        newPost += '</div>'
        newPost += '</div>'

        $('.postContainer').prepend(newPost).each(function(){
            $('.postMainBox').show(400)
            $('.homeScrollContainer').niceScroll({cursorcolor:'#ffc438', cursorwidth:'10px', cursoropacitymin:'0.8', background:'none', cursorborder:'0px'})
        })
    })
    
    backend.on('newPostGetUrlMeta', function(title, images, description, url){
        if(images[0]){
            $('.homeNewPostUrlMetaBox').children('.homeNewPostUrlMetaImage').attr('src', images[0])
        }
        $('.homeNewPostUrlMetaTitle').html(title)
        $('.homeNewPostUrlMetaUrl').html(url)
        $('.homeNewPostUrlMetaDescription').html(description + '...')
        $('.homeNewPostUrlMetaBox').show(400)
    })
    
    $('.contentBox').on('click', '.postAvatar', function(){
        loadUserProfile($(this).attr('id'))
    })
    
    $('.contentBox').on('click', '.postPoster', function(){
        loadUserProfile($(this).attr('id'))
    })

})
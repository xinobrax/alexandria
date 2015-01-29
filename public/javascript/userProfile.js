var settingsChannel = io('/settings')

function loadProfile(){
    settingsChannel.emit('getUserProfile', $('#userId').val())
}

settingsChannel.on('getUserProfile', function(userProfile){
    $('input[name=username]').val(userProfile.username)
    $('#avatar').attr({ src:'images/users/' + userProfile._id + '.jpg' })
    $('input[name=email]').val(userProfile.email)
    $('input[name=jabber]').val(userProfile.jabber)
    $('input[name=toxid]').val(userProfile.toxid)
    $('input[name=diaspora]').val(userProfile.diaspora)
    $('input[name=bitcoin]').val(userProfile.bitcoin)
})

$( document ).ready(function() {

    $('.content_box').on('click', 'button[name=saveChanges]', function(){    

        var userId = $('#userId').val()
        var user = {
            email: $('input[name=email]').val(),
            jabber: $('input[name=jabber]').val(),
            toxid: $('input[name=toxid]').val(),
            diaspora: $('input[name=diaspora]').val(),

            bitcoin: $('input[name=bitcoin]').val()
        }
        settingsChannel.emit('setUserProfile', userId, user)
    })
})
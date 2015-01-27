module.exports.formatChatMessage = function(message){
    
    /*
    if(message.search('youtube.com/watch\\?v=') !== -1){
        message = message.substring(msg.message.search('youtube.com/watch\\?v=')+20)
        message = '<a href=\'https://www.youtube.com/watch?v=' + message + '\' target=\'_blank\'><img src=\'http://img.youtube.com/vi/' + message + '/mqdefault.jpg\' width=\'150\' /></a>'
    }
    */
    
    message = message.replace(':)', '<img src=\'images/smilies/icon_e_smile.gif\' />')
    message = message.replace(':D', '<img src=\'images/smilies/icon_e_biggrin.gif\' />')
    message = message.replace('O_O', '<img src=\'images/smilies/icon_eek.gif\' />')
    message = message.replace('8)', '<img src=\'images/smilies/icon_cool.gif\' />')
    message = message.replace(':|', '<img src=\'images/smilies/icon_neutral.gif\' />')
    message = message.replace('XD', '<img src=\'images/smilies/xd.gif\' />')
    
    message = message.replace('FACEPALM', '<img src=\'images/smilies/facepalm.gif\' />')
    message = message.replace('ENCRYPTION', '<img src=\'images/smilies/icon_cool.gif\' />')
    message = message.replace('LOL', '<img src=\'images/smilies/icon_lol.gif\' />')
    message = message.replace('ZZZ', '<img src=\'images/smilies/zzz.gif\' />')
    message = message.replace('GROEL', '<img src=\'images/smilies/groel.gif\' />')
    message = message.replace('1THUMB', '<img src=\'images/smilies/1thumb.gif\' />')
    
    message = message.replace('LQL', '<img src=\'images/smilies/lql.png\' />')
    message = message.replace('ISEE', '<img src=\'images/smilies/isee.png\' />')
    message = message.replace('DAFUQ', '<img src=\'images/smilies/dafuq.png\' />')
    message = message.replace('DOGE', '<img src=\'images/smilies/doge.png\' />')
    message = message.replace('WAITING', '<img src=\'images/smilies/waiting.png\' />')
    
    message = message.replace(':?:', '<img src=\'images/smilies/questionblock.gif\' />')
    message = message.replace('SMW1', '<img src=\'images/smilies/supermario.gif\' />')
    message = message.replace('SMW2', '<img src=\'images/smilies/supmarioyoshi.gif\' />')
    message = message.replace('CHRONO', '<img src=\'images/smilies/chrono.gif\' />')
    message = message.replace('ALTTP', '<img src=\'images/smilies/alttp.gif\' />')
    message = message.replace('KIRBY', '<img src=\'images/smilies/kirbydance.gif\' />')
    
    return message
}
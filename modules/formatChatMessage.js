module.exports.formatChatMessage = function(message){
    
    /*
    if(message.search('youtube.com/watch\\?v=') !== -1){
        message = message.substring(msg.message.search('youtube.com/watch\\?v=')+20)
        message = '<a href=\'https://www.youtube.com/watch?v=' + message + '\' target=\'_blank\'><img src=\'http://img.youtube.com/vi/' + message + '/mqdefault.jpg\' width=\'150\' /></a>'
    }
    */
    
    message = message.replace(':)', '<img src=\'images/smilies/icon_e_smile.gif\' title=\':)\' />')
    message = message.replace(':D', '<img src=\'images/smilies/icon_e_biggrin.gif\' title=\':D\' />')
    message = message.replace('O_O', '<img src=\'images/smilies/icon_eek.gif\' title=\'O_O\' />')
    message = message.replace('8)', '<img src=\'images/smilies/icon_cool.gif\' title=\'8)\' />')
    message = message.replace(':|', '<img src=\'images/smilies/icon_neutral.gif\' title=\':|\' />')
    message = message.replace('XD', '<img src=\'images/smilies/xd.gif\' title=\'XD\' />')
    
    message = message.replace('FACEPALM', '<img src=\'images/smilies/facepalm.gif\' title=\'FACEPALM\' />')
    message = message.replace('ENCRYPTION', '<img src=\'images/smilies/icon_cool.gif\' title=\'ENCRYPTION\' />')
    message = message.replace('LOL', '<img src=\'images/smilies/icon_lol.gif\' title=\'LOL\' />')
    message = message.replace('ZZZ', '<img src=\'images/smilies/zzz.gif\' title=\'ZZZ\' />')
    message = message.replace('GROEL', '<img src=\'images/smilies/groel.gif\' title=\'GROEL\' />')
    message = message.replace('1THUMB', '<img src=\'images/smilies/1thumb.gif\' title=\'1THUMB\' />')
    
    message = message.replace('LQL', '<img src=\'images/smilies/lql.png\' title=\'LQL\' />')
    message = message.replace('ISEE', '<img src=\'images/smilies/isee.png\' title=\'ISEE\' />')
    message = message.replace('DAFUQ', '<img src=\'images/smilies/dafuq.png\' title=\'DAFUQ\' />')
    message = message.replace('DOGE', '<img src=\'images/smilies/doge.png\' title=\'DOGE\' />')
    message = message.replace('WAITING', '<img src=\'images/smilies/waiting.png\' title=\'WAITING\' />')
    
    message = message.replace(':?:', '<img src=\'images/smilies/questionblock.gif\' title=\':?:\' />')
    message = message.replace('SMW1', '<img src=\'images/smilies/supermario.gif\' title=\'SMW1\' />')
    message = message.replace('SMW2', '<img src=\'images/smilies/supmarioyoshi.gif\' title=\'SMW2\' />')
    message = message.replace('CHRONO', '<img src=\'images/smilies/chrono.gif\' title=\'CHRONO\' />')
    message = message.replace('ALTTP', '<img src=\'images/smilies/alttp.gif\' title=\'ALTTP\' />')
    message = message.replace('KIRBY', '<img src=\'images/smilies/kirbydance.gif\' title=\'KIRBY\' />')
    
    return message
}
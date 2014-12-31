module.exports.formatChatMessage = function(message){
    if(message.search('youtube.com/watch\\?v=') !== -1){
        message = message.substring(msg.message.search('youtube.com/watch\\?v=')+20)
        message = '<a href=\'https://www.youtube.com/watch?v=' + message + '\' target=\'_blank\'><img src=\'http://img.youtube.com/vi/' + message + '/mqdefault.jpg\' width=\'150\' /></a>'
    }
    
    message = message.replace(':)', '<img src=\'images/smilies/icon_e_smile.gif\' />')
    message = message.replace(':D', '<img src=\'images/smilies/icon_e_biggrin.gif\' />')
    message = message.replace(':lol:', '<img src=\'images/smilies/icon_lol.gif\' />')
    message = message.replace(':|', '<img src=\'images/smilies/icon_neutral.gif\' />')
    message = message.replace(':facepalm:', '<img src=\'images/smilies/facepalm.gif\' />')
    message = message.replace('O_O', '<img src=\'images/smilies/icon_eek.gif\' />')
    message = message.replace('8)', '<img src=\'images/smilies/icon_cool.gif\' />')
    message = message.replace(':encryption:', '<img src=\'images/smilies/icon_cool.gif\' />')
    message = message.replace(':zzz:', '<img src=\'images/smilies/zzz.gif\' />')
    message = message.replace(':groel:', '<img src=\'images/smilies/groel.gif\' />')
    message = message.replace(':1thumb:', '<img src=\'images/smilies/1thumb.gif\' />')
    message = message.replace(':1thumb:', '<img src=\'images/smilies/1thumb.gif\' />')
    message = message.replace('XD', '<img src=\'images/smilies/xd.gif\' />')
    message = message.replace('LQL', '<img src=\'images/smilies/lql.png\' />')
    message = message.replace('ISEE', '<img src=\'images/smilies/isee.png\' />')
    message = message.replace('DAFUQ', '<img src=\'images/smilies/dafuq.png\' />')
    message = message.replace('DOGE', '<img src=\'images/smilies/doge.png\' />')
    message = message.replace('WAITING', '<img src=\'images/smilies/waiting.png\' />')
    
    return message
}
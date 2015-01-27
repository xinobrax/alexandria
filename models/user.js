var DB = require('../db').DB

var User = DB.Model.extend({
    tableName: 'users',
    idAttribute: 'user_id',
    
    messages: function() {
        return this.belongsTo(Message, 'user_id')
    },
    
    channelSubscriptions: function() {
        return this.hasMany(UserChannel, 'user_idfs')
    }
})

var Channel = DB.Model.extend({
    tableName: 'channels',
    idAttribute: 'channel_id',
    
    subscriptions: function() {
        return this.hasMany(UserChannel, 'channel_idfs')
    },
    
    userSubscriptions: function() {
        return this.hasMany(User, 'user_idfs')
    }
})

var Episode = DB.Model.extend({
    tableName: 'episodes',
    idAttribute: 'episode_id',
    
    count: function (channel, cb) {
        DB.knex('episodes')
        .count('*')
        .where({ channel_idfs:channel})
        .then(function (count) {
            cb(null, count)
        })
        .catch(function (err) {
            cb(err)
        })
    }
})

var Room = DB.Model.extend({
    tableName: 'rooms',
    idAttribute: 'room_id',
    
    messages: function() {
        return this.hasMany(Message, 'room_idfs')
    }
})

var Message = DB.Model.extend({
    tableName: 'messages',
    
    user: function() {
        return this.belongsTo(User, 'user_idfs')
    }
})

var UserChannel = DB.Model.extend({
    tableName: 'x_user_channel',
})

    
module.exports = {
    Query: DB.knex,
    User: User,
    Channel: Channel,
    Episode: Episode,
    Room: Room,
    Message: Message
}

module.exports.getChannelsByLatestEpisode = function(){
    var query= ''
    query += 'SELECT '
    query += '    channel_id, '
    query += '    channels.title, '
    query += '    channels.feed, '
    query += '    type_idfs, '
    query += '    filter, '
    query += '    MAX(date) as date '
    query += 'FROM '
    query += '    channels '
    query += 'LEFT JOIN '
    query += '    episodes '
    query += 'ON '
    query += '    (channel_id = channel_idfs) '
    query += 'GROUP BY '
    query += '    channel_idfs '
    return query
}
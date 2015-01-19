var DB = require('../db').DB

var User = DB.Model.extend({
    tableName: 'users',
    idAttribute: 'user_id',
    
    messages: function() {
        return this.belongsTo(Message, 'user_id')
    }
})

var Channel = DB.Model.extend({
    tableName: 'channels',
    idAttribute: 'channel_id',
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

module.exports = {
    User: User,
    Channel: Channel,
    Episode: Episode,
    Room: Room,
    Message: Message
}
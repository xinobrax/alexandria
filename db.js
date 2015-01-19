var knex = require('knex')({
    client: 'mysql',
    connection: {
        host     : 'localhost',
        user     : 'alexandria',
        password : '',
        database : 'alexandria',
        charset  : 'utf8'
    }
})

var bookshelf = require('bookshelf')(knex)

module.exports.DB = bookshelf
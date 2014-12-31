var passport = require('passport')
var User = require('./models/user')

module.exports = function(app){
    app.get('/', function(req, res){
        res.render('pages/login', {user:req.user})
    })
    
    app.get('/register', function(req, res){
        res.render('pages/register', {})
    })
    
    app.post('/register', function(req, res){
        
        if(req.body.command == 'login'){
            console.log('login')
        }
      
        User.register(new User({username:req.body.username}), req.body.password, function(err, user){            
            if(err){                
                return res.render('login', {user:user})
            }
            
            passport.authenticate('local')(req, res, function(){
                res.redirect('/')
            })
        })
       
    })
    
    app.get('/login', function(req, res){
        res.render('pages/login', {user:req.user})
    })
    
    app.post('/login', passport.authenticate('local', {
        //res.redirect('index')
        successRedirect: 'index',
        failureRedirect: '/'
    }))
    
    app.get('/logout', function(req, res){
        req.logout()
        res.redirect('/')
    })
    
    app.get('/index', function(req, res){        
        if(!req.user) return res.redirect('/')     
        module.exports.username = req.user['username']
        res.render('pages/index', {user:req.user})
    })
    
    app.get('/ping', function(req, res){
        res.send('pong!', 200)
    })
}
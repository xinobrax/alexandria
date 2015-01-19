var passport = require('passport')
var bcrypt = require('bcrypt-nodejs')
var User = require('./models/user')

module.exports = function(app){
    app.get('/', function(req, res){
        res.render('pages/login', {user:req.user})
    })
    
    app.get('/register', function(req, res){
        res.render('pages/register', {})
    })
    
    app.post('/register', function(req, res, next){
        var user = req.body;
        var usernamePromise = null;
        usernamePromise = new User.User({username: user.username}).fetch()

        return usernamePromise.then(function(model) {
            if(model) {
                res.render('pages/login', {title: 'signup', errorMessage: 'username already exists'})
            } else {
                var password = user.password;
                var hash = bcrypt.hashSync(password)

                var signUpUser = new User.User({username: user.username, password: hash})

                signUpUser.save().then(function(model) {
                    // sign in the newly registered user
                    signInPost(req, res, next)
                })
            }
        })
    })
    
    app.get('/login', function(req, res){
        res.render('pages/login', {user:req.user})
    })
    
    app.post('/login', function(req, res, next){
        passport.authenticate('local', { successRedirect: '/', failureRedirect: '/signin'}, function(err, user, info) {
            if(err) {
                return res.render('signin', {title: 'Sign In', errorMessage: err.message})
            } 

            if(!user) {
                return res.render('signin', {title: 'Sign In', errorMessage: info.message})
            }
            return req.logIn(user, function(err) {
                if(err) {
                    return res.render('signin', {title: 'Sign In', errorMessage: err.message})
                } else {
                    return res.redirect('/index')
                }
            })
        })(req, res, next);
    })
    
    app.get('/logout', function(req, res){
        req.logout()
        res.redirect('/')
    })
    
    app.get('/index', function(req, res){        
        if(!req.user) return res.redirect('/')     
        //console.log(req.user.attributes['user_id'])
        module.exports.username = req.user.attributes['username']
        res.render('pages/index', {user:req.user.attributes})
    })
    
    app.get('/ping', function(req, res){
        res.send('pong!', 200)
    })
}
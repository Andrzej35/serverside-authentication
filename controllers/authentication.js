const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    // in jwt convention: sub: subject, iat: issue at time
    //  ref: https://jwt.io/
    return jwt.encode({ 
        sub: user.id,
        iat: timestamp
    }, config.secret);
}

exports.signin = function(req, res, next) {
    // User has been authenticated
    // need to pass the token
    res.send({ token: tokenForUser(req.user) });
};

exports.signup = function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password) {
        return res.status(422).send({ error: 'You must provide email and password'});
    }

    // See if a user with a given email exists
    User.findOne({email: email}, function(err, exUser){
        if(err) {return next(err);}

        // if a user exists return error
        if(exUser) {
            return res.status(422).send({error: 'Email is in use'});
        }

        // if a user with email does NOT exist, create and save user record
        const user = new User({
            email: email, 
            password: password
        });

        user.save(function(err) {
            if(err) {
                return next(err);
            }

            // respond to request indicating the user was created
            res.json({  token: tokenForUser(user) });
        });
        
    });
    
};
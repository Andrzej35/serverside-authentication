const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy
const localLogin = new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {

    // verify email and password
    // if it is correct
    // or call done with false
    User.findOne({ email: email }, function(err, user) {
        if(err) { return done(err); }
        if(!user) { return done(null, false); }
       
        // compare passwords
        user.comparePassword(password, function(err, isTrue) {
            if(err) { return done(err); }
            if(!isTrue) { return done(null, false); }

            return done(null, user);
        });
    });

});

// Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {

    // user id in payload exists in our DB
    // If it does, call 'done' with that other
    // otherwise, call done without user object
    User.findById(payload.sub, function(err, user) {
        
        if(err) { return done(err, false); }
        
        if(user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});


// Tell passport to use this Strategy
passport.use(jwtLogin);
passport.use(localLogin);
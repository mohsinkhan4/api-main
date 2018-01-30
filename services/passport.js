/*
 *  Passport is an ecosystem to enable the application to redirect the user in case he is stumbling on a protected page when
 *  he is not authenticated.
 *  Startegies are like plugins to the passport.
*/

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const config = require('../config');

//Local Strategy
const localOptions = { usernameField: 'email' }
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    // Verify the email and password
    // if correct, call done with the user
    // else, call done with false

    User.findOne({ email: email }, function(err, user) {
        if(err) { console.error(err);  return done(err); }

        if(!user) { return done(null, false); }

        // compare passwords
        user.comparePassword(password, function(err, isMatch) {
            if(err) { console.error(err);  return done(err); }

            if(!isMatch) { return done(null, false); }

            return done(null, user);
        });
    });
});

// setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    // See if the user ID in the payload exists in our DB
    // if it does, call done with the user id
    // else, call done without a user object

    User.findById(payload.sub, function(err, user) {
        if(err) { console.error(err);  return done(err, false); }

        if(user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);

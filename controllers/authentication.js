const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();

    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret); // what is sub and iat?
}

exports.signup = function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password) {
        return res.status(422).send({ error: 'Please enter an email and password' });
    }

    console.log(req.body, email, User.findOne);
    User.findOne({ email: email }, function(err, existingUser) {
        if(err) { console.error(err);  return next(err); }

        if(existingUser) {
            return res.status(422).send({ error: 'Email is in use' });
        }

        const user = new User({
            email: email,
            password: password
        });

        user.save(function(err) {
            if(err) { console.error(err);  return next(err); }

            res.json({ token : tokenForUser(user) }); // for token based authentication
        });
    });
}

exports.signin = function(req, res, next) {
    // Return a token for the user with correct email/password combination

    res.send({ token: tokenForUser(req.user) })
}

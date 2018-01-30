const passport = require('passport');
const passportService = require('./services/passport');
const Authentication = require('./controllers/authentication');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSigin = passport.authenticate('local', { session: false });

module.exports = function(app) {
    app.post('/signup', Authentication.signup);
    app.post('/signin', requireSigin, Authentication.signin);

    app.get('/', requireAuth, function(req, res) {
        res.send({ message: 'super secret code is ABC123' });
    })
}

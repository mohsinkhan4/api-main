const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const COLLECTION_USER = 'user';

// Model definition
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

// on save hook, encrypt password
userSchema.pre('save', function(next) {
    const user = this;

    bcrypt.genSalt(10, function(err, salt) {
        if(err) { console.error(err);  return next(err); }

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if(err) { console.error(err);  return next(err); }

            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) { console.error(err);  return callback(err); }

        callback(null, isMatch);
    })
}

// Create the model class
const ModelClass = mongoose.model(COLLECTION_USER, userSchema);

// Export the Model
module.exports = ModelClass;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Model definition
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

// On Save Hook, encrypt password
userSchema.pre('save', function(next) {
    const user = this;

    // generate a salt then run callback
    bcrypt.genSalt(10, function(err, salt){
        if(err) { return next(err); }

        // encrypt (hash) our password using the salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if(err) { return next(err); }

            // overwrite plain text password with encrypted password
            user.password = hash;
            next();
        })
    })
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isTrue) {
        if(err) { return cb(err); }
        cb(null, isTrue);
    });
};

// Model Class
const Model = mongoose.model('user', userSchema);

// Export the model
module.exports = Model;
"use strict";
/*
 *  Defined the Mongoose Schema and return a Model for a User
 */
/* jshint node: true */

var Promise = require('bluebird');
var mongoose = require('mongoose');
const bcrypt = Promise.promisifyAll(require('bcrypt'));
const saltrounds = 10;

// create a schema
var userSchema = new mongoose.Schema({
    id: String,     // Unique ID identifying this user
    first_name: String, // First name of the user.
    last_name: String,  // Last name of the user.
    location: String,    // Location  of the user.
    description: String,  // A brief user description
    occupation: String,    // Occupation of the user.
    login_name: String,  // Login name of the user
    password_digest: String,    // Password digest salted user's salted password
});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified) return next();

    bcrypt.genSaltAsync(saltrounds)
        .then(function(salt) {
            return bcrypt.hashAsync(user.password_digest, salt);
        }).then(function(hash) {
            user.password_digest = hash;
        }).asCallback(next);
});

// Static Methods
// Generates list of all Users with only their ids, first names, and last names
userSchema.statics.generateUserList = function() {
    return this.find({}).select('_id first_name last_name').sort({_id: 1}).exec();
};

// Returns single user with all fields when queried by id
userSchema.statics.findUserById = function(id, projection) {
    var query = this.findById(id);
    if (projection) query = query.select(projection);
    return query.exec();
};

userSchema.statics.findUserByLoginName = function(login_name, projection) {
    var query = this.findOne({login_name: login_name});
    if (projection) query = query.select(projection);
    return query.exec();
};

// Returns true if username already exists in database
userSchema.statics.userExists = function(login_name) {
    return this.findOne({login_name: login_name}).select('_id').exec()
        .then(function(result) {
            return result !== null;
        });
};

// Returns salt from userId
userSchema.statics.getPasswordHash = function(login_name) {
    return this.findOne({login_name: login_name}).select('password_digest').exec();
};

// Instance Methods
// Compares supplied password with hash of schema instance
userSchema.methods.comparePassword = function(password) {
    return bcrypt.comapareAsync(password, this.password_digest);
};
// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;

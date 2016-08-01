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
    username: {
        type: String,  // Login name of the user
        require: [true, 'Username is required']
    },
    password: {
        type: String,    // Password digest salted user's salted password
        require: [true, 'No password provided'],
        min: 12
    },
    first_name: {
        type: String, // First name of the user.
        required: [true, 'No first name provided']
    },
    last_name: {
        type: String,  // Last name of the user.
        required: [true, 'No last name provided']
    },
    location: String,    // Location  of the user.
    description: String,  // A brief user description
    occupation: String,    // Occupation of the user.
});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified) return next();

    bcrypt.genSaltAsync(saltrounds)
        .then(function(salt) {
            return bcrypt.hashAsync(user.password, salt);
        }).then(function(hash) {
            user.password = hash;
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

userSchema.statics.findUserByLoginName = function(username, projection) {
    var query = this.findOne({username: username});
    if (projection) query = query.select(projection);
    return query.exec();
};

// Returns true if username already exists in database
userSchema.statics.userExists = function(username) {
    return this.findOne({username: username}).select('_id').exec()
        .then(function(result) {
            return result !== null;
        });
};

// Returns salt from userId
userSchema.statics.getPasswordHash = function(username) {
    return this.findOne({username: username}).select('password').exec();
};

// Updates user and returns modified doc
userSchema.statics.updateUser = function(id, userData) {
    return this.findByIdAndUpdate(id, userData, {new: true}).exec();
};

// Deletes user from database
userSchema.statics.deleteUserById = function(id) {
    return this.findByIdAndRemove(id).exec();
};

// Instance Methods
// Compares supplied password with hash of schema instance
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareAsync(password, this.password);
};
// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;

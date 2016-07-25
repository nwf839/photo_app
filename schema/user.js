"use strict";
/*
 *  Defined the Mongoose Schema and return a Model for a User
 */
/* jshint node: true */

var mongoose = require('mongoose');

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
    salt: String    // Salt used to hash user's password
});

// static methods

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

// Returns salt from userId
userSchema.statics.getPasswordEntryFromUsername = function(login_name) {
    var res = this.findOne({login_name: login_name}).select('password_digest salt').exec();
    console.log(res);
    return res;
};

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;

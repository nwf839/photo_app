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
    password: String    // Password of the user
});

// static methods

// Generates list of all Users with only their ids, first names, and last names
userSchema.statics.generateUserList = function() {
    return this.find({}).select('_id first_name last_name').exec();
};

// Returns single user with all fields when queried by id
userSchema.statics.findUserById = function(id, projection) {
    var query = this.findById(id);
    if (projection) query = query.select(projection);
    return query.exec();
};

// Returns single user when queried by login_name
userSchema.statics.findUserOnLogin = function(loginObj) {
    return this.findOne(loginObj).select('_id first_name last_name').exec();
};

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
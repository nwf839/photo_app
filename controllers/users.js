'use strict';

var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    User = require('../schema/user.js'),
    respondOnSuccess = require('../helpers/respondOnSuccess.js');

module.exports.getUser = function (request, response, next) {
    User.findUserById(request.params.id, '_id first_name last_name location occupation description')
        .then(userQueryIsValid)
        .then(respondOnSuccess.bind(null, response))
        .catch(next);
};

var userQueryIsValid = function(result) {
    if (result === null) {
        var err = new Error('User does not exist');
        err.status = 400;
        throw err;
    } else return result;
}

var userIdIsValid = function(id) {
    if (id === null) return null;
    if (mongoose.Types.ObjectId.isValid(id) === false) {
        var err = new Error('Invalid user id');
        err.status = 400;
        throw err;
    }
    return id;
}

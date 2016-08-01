'use strict';

/**
 * Dependencies
 */
var Promise = require('bluebird'),
    respondOnSuccess = require('../helpers/respondOnSuccess.js'),
    copyMongoDoc = require('../helpers/copyMongoDoc.js'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Photo = mongoose.model('Photo');

module.exports.getComments = function(request, response, next) {
    Photo.getCommentsByUserId(request.params.id)
        .then(respondOnSuccess.bind(null, response))
        .catch(next);
};

module.exports.addComment = function(request, response, next) {
    Photo.addComment(request.params.photoId, request.user._id, request.body.comment)
        .then(respondOnSuccess.bind(null, response))
        .catch(next);
};

module.exports.deleteComment = function(request, response, next) {
    Photo.deleteComment(request.params.id)
        .then(respondOnSuccess.bind(null, response))
        .catch(next);
};

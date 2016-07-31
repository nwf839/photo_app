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
    Photo.findByIdAndUpdate(request.params.photoId, request.user._id, request.body.comment)
        .then(copyMongoDoc)
        .then(module.exports.modifyComments.bind(null, next))
        .then(respondOnSuccess.bind(null, response))
        .catch(next)
};

// XXX: DOES NOT WORK, AT LEAST ON FRONT END
module.exports.modifyComments = function(next, photo) {
    console.log(photo);
    return Promise.map(photo.comments, function(comment) {
        return User.findUserById(comment.user_id, '_id first_name last_name')
            .then(copyMongoDoc)
            .then(function(user) {
                delete comment.user_id;
                comment.user = user;
                return comment;
            }).catch(next);
    }).then(function(comments) {
        console.log(comments);
        photo.comments = comments;
        return photo;
    }).catch(next);
};

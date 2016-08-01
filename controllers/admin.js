'use strict';

var Promise = require('bluebird'),
    deletePhotoFile = require('./photos.js'),
    respondOnSuccess = require('../helpers/respondOnSuccess.js');

module.exports.login = function(request, response, next) {
    respondOnSuccess(response, request.user);
};

module.exports.logout = function(request, response, next) {
    Promise.resolve(request.logOut())
        .then(function() {
            request.session.destroy();
        }).then(respondOnSuccess.bind(null, response))
        .catch(next);
};

module.exports.register = function(request, response, next) {
    respondOnSuccess(response, request.user);
};

module.exports.deleteAccount = function(request, response, next) {
    var id = request.user._id,
        removePhotos = function(id) {
            Photo.findPhotosByUserId(id)
                .then(function(result) {
                    Promise.map(result, deletePhotoFile);
                    return result;
                }).then(function(result) {
                    return result.remove().exec();
                });
        },
        removeComments = function(id) {
            Photo.getCommentsByUserId(request.id).remove().exec();
        },
        removeUser = function(id) {
            User.deleteUserById(id);
        };
        
        Promise.join(removePhotos, removeComments, removeUser, module.exports.logout);
};

module.exports.getStatus = function(request, response, next) {
    var data = (request.user || {});
    console.log(data);
    respondOnSuccess(response, data);
};

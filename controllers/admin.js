'use strict';

var Promise = require('bluebird'),
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

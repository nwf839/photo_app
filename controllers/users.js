'use strict';

var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    Photo = require('../schema/photo.js'),
    User = require('../schema/user.js'),
    respondOnSuccess = require('../helpers/respondOnSuccess.js'),
    copyMongoDoc = require('../helpers/copyMongoDoc.js');

module.exports.getUsers = function (request, response, next) {
    var userList = [],
    setUserList = function(result) {
        userList = result;
    },
    getPhotoCounts = function() {
        return Photo.getPhotoCounts()
            .then(copyMongoDoc)
            .then(mergeCountsToList);
    },
    getCommentCounts = function() {
        return Photo.getCommentCounts()
            .then(copyMongoDoc)
            .then(function(result) {
                console.log(result);
                return result;
            })
            .then(mergeCountsToList);
    },
    fetchData = function(result) {
        return Promise.join(getPhotoCounts(), getCommentCounts(), function() {
            return userList;
        });
    },
    mergeCountsToList = function(counts) {
        var key = Object.keys(counts[0])[1];
        return Promise.map(userList, function(listItem) {
            return Promise.filter(counts, function(countsItem) {
                return countsItem._id === listItem._id;
            }).then(function(result) {
                if (result.length === 1) listItem[key] = result[0][key];
                else listItem[key] = 0;
                return listItem;
            });
        });
    };
    User.generateUserList()
        .then(copyMongoDoc)
        .then(setUserList)
        .then(fetchData)
        .then(respondOnSuccess.bind(null, response))
        .catch(next);
};

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

'use strict';

var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    Photo = require('../schema/photo.js'),
    User = require('../schema/user.js'),
    respondOnSuccess = require('../helpers/respondOnSuccess.js'),
    copyMongoDoc = require('../helpers/copyMongoDoc.js');


module.exports.getList = function (request, response, next) {
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


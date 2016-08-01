'use strict';

var Promise = require('bluebird');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../schema/user.js');


module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        Promise.resolve(user._id)
            .asCallback(done); 
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id)
        // XXX PASSPORT ONLY WORKS WITH THIS EXTRA STEP
        // NO IDEA WHY, PROBABLY HAS TO DO WITH .asCallback
           .then(function(result) {
               return result;
           }).asCallback(done);
    });
    
    passport.use('login', new LocalStrategy(function(username, password, done) {
        var user = {};
        User.findUserByLoginName(username)
            .then(function(result) {
                if (result === null) {
                    var err = new Error('Username Invalid');
                    err.status = 401;
                    throw err;
                }
                user = result;
                return user.comparePassword(password);
            }).then(function(isMatch) {
                if (isMatch === false) {
                    var err = new Error('Invalid Password');
                    err.status = 401;
                    throw err;
                }
                return user;
            }).asCallback(done);
    }));

    passport.use('register', new LocalStrategy({
        passReqToCallback: true
    }, function(request, username, password, done) {
        var user = {};
            User.findUserByLoginName(username, '_id')
                .then(function(result) {
                    if (result !== null) {
                        var err = new Error('Username Already in Use');
                        err.status = 401;
                        throw err;
                    } else {
                        return result;
                    }
                }).then(function(result) {
                    console.log(request.body);
                    var newUser = new User(request.body);
                    return newUser.save()
                        .then(function(result) {
                            user = result;
                            return user;
                        });
                }).asCallback(done);
        }));
};

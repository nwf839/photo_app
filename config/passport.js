'use strict';

var Promise = require('bluebird');
var Password = require('./helpers/cs142password.js');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./schema/user.js');


module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        Promise.resolve(user._id).asCallback(done);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id).asCallback(done);
    });
    
    passport.use('login', new LocalStrategy({passReqToCallback: true}, 
        function(request, login_name, password, done) {
            var user = false;
            var message = 'Login Successful';
            User.findUserByLoginName(login_name)
                .then(function(result) {
                    if (result === null) {
                        message = 'Invalid Username';
                        return true;
                    } else {
                        user = result;
                        return Password.checkPassword(user.password_digest);
                    }
                }).then(function(isMatch) {
                    if (isMatch === false) {
                        user = false;
                        message = 'Invalid Password';
                    }
                    return [user, message];
                }).asCallback(done, {spread: true});
        }));

    passport.use('register', new LocalStrategy({passReqToCallback: true},
        function(request, login_name, password, done) {
            var user = false;
            var message = 'Registration Successful';
            User.findUserByLoginName(login_name, '_id')
                .then(function(result) {
                    if (result !== null) {
                        message = 'Username Already Taken';
                    } else {
                        return Password.hashPassword(password);
                    }
                }).then(function(result) {
                    request.body.password_digest = result;
                    delete request.body.password;
                    user = new User(request.body);
                    return user.save()
                        .then(function() {
                            return [user, message];
                        });
                }).asCallback(done, {spread: true});
        }));
};
                    
};

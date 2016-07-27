'use strict';

var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
const saltRounds = 10;

/*
 * Return a salted and hashed password entry from a
 * clear text password.
 * @param {string} clearTextPassword
 * @return {string} 
 *
 */
module.exports.hashPassword = function(clearTextPassword) {
    var hash = function(salt) {
        return bcrypt.hashAsync(clearTextPassword, salt);
    };

    return bcrypt.genSaltAsync(saltRounds)
        .then(hash);
};

/*
 * Return true if the specifed clear text hashes to
 * the specified hash parameter
 * @param {string} clearTextPassword
 * @param {string} hash
 * @return {boolean}
 *
 */
module.exports.checkPassword = function(clearTextPassword, hash) {
    return bcrypt.compareAsync(clearTextPassword, hash);
};

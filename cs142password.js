'use strict';

const crypto = require('crypto');
/*
 * Return a salted and hashed password entry from a
 * clear text password.
 * @param {string} clearTextPassword
 * @return {object} passwordEntry
 * where passwordEntry is an object with two string
 * properties:
 *      salt - The salt used for the password
 *      hash - The sha1 hash of the password and salt
 *
 */
function makePasswordEntry(clearTextPassword) {
    var generateSalt = function() {
        return new Promise(function(resolve, reject) {
            crypto.randomBytes(8, function(err, buffer) {
                if (err) reject(err);
                else resolve({salt: buffer.toString('hex')});
            });
        });
    },
    createHash = function(passwordEntry) {
        var hash = crypto.createHash('sha1');
        passwordEntry.hash = hash.update(clearTextPassword.concat(passwordEntry.salt)).digest('hex');
        //console.log(passwordEntry);
        return passwordEntry;
    };

    return generateSalt()
        .then(createHash);
};

/*
 * Return true if the specifed clear text password
 * and salt generates the specified hash.
 * @param {string} hash
 * @param {string} salt
 * @param {string} clearTextPassword
 * @return {boolean}
 */
function doesPasswordMatch(hash, salt, clearTextPassword) {
    var testHash = crypto.createHash('sha1').update(clearTextPassword.concat(salt));
    return hash === testHash.digest('hex');
};

module.exports.makePasswordEntry = makePasswordEntry;
module.exports.doesPasswordMatch = doesPasswordMatch;

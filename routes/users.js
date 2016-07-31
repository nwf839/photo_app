'use strict';

var users = require('../controllers/users.js');

module.exports = function(app, ensureAuthenticated) {
    app.get('/user/list', users.getUsers);
    app.get('/user/:id', ensureAuthenticated, users.getUser);
};

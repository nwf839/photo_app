'use strict';

var admin = require('../controllers/admin.js');

module.exports = function(app, passport) {
    app.post('/admin/login', passport.authenticate('login'), admin.login);
    app.post('/admin/logout', admin.logout);
    app.post('/admin/register', passport.authenticate('register'), admin.register);
    app.post('/admin/status', admin.getStatus);
};

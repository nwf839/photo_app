'use strict';

var admin = require('../controllers/admin.js'),
    passport = require('passport'),
    express = require('express'),
    router = express.Router();

module.exports = (function() {
    router.post('/admin/login', passport.authenticate('login'), admin.login);
    router.post('/admin/logout', admin.logout);
    router.post('/admin/register', passport.authenticate('register'), admin.register);
    router.post('/admin/status', admin.getStatus);
    return router;
})();

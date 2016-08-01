'use strict';

var users = require('../controllers/users.js'),
    express = require('express'),
    ensureAuthenticated = require('../middleware/ensureAuthenticated.js'),
    router = express.Router();

module.exports = (function() {
    router.use(ensureAuthenticated);
    router.get('/user/:id', users.getUser);
    router.put('/user/:id', users.updateUser);
    return router;
})();

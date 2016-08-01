'use strict';

var userList = require('../controllers/userList.js'),
    express = require('express'),
    router = express.Router();

module.exports = (function() {
    router.get('/user/list', userList.getList);
    return router;
})();

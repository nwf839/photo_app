'use strict';

var test = require('../controllers/test.js'),
    express = require('express'),
    router = express.Router();

module.exports = (function() {
    router.get('/test/:p1', test.test);
    return router;
})();

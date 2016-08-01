'use strict';

var express = require('express'),
    router = express.Router();

module.exports = (function(ensureAuthenticated) {
    router.use(require('./admin.js'));
    router.use(require('./userList.js'));
    router.use(require('./users.js'));
    router.use(require('./photos.js'));
    router.use(require('./comments.js'));
    router.use(require('./test.js'));
    return router;
})();

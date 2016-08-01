'use strict';

var comments = require('../controllers/comments.js'),
    express = require('express'),
    ensureAuthenticated = require('../middleware/ensureAuthenticated.js'),
    router = express.Router();

module.exports = (function() {
    router.get('/comments/:id', ensureAuthenticated, comments.getComments);
    router.post('/commentsOfPhoto/:photoId', ensureAuthenticated, comments.addComment);
    return router;
})();

'use strict';

var comments = require('../controllers/comments.js'),
    express = require('express'),
    ensureAuthenticated = require('../middleware/ensureAuthenticated.js'),
    router = express.Router();

module.exports = (function() {
    router.use(ensureAuthenticated);
    router.get('/comments/:id', comments.getComments);
    router.post('/commentsOfPhoto/:photoId', comments.addComment);
    router.delete('comment/:id', comments.deleteComment);
    return router;
})();

'use strict';

var comments = require('../controllers/comments.js'),
    photos = require('../controllers/photos.js'),
    express = require('express'),
    ensureAuthenticated = require('../middleware/ensureAuthenticated.js'),
    router = express.Router();

module.exports = (function() {
    router.use(ensureAuthenticated);
    router.get('/comments/:id', comments.getComments);
    router.put('/commentsOfPhoto/:photoId', comments.addComment);
    router.get('/commentsOfPhoto/:photoId', comments.getCommentPhoto);
    router.delete('/commentsOfPhoto/:id', photos.deletePhoto);
    return router;
})();

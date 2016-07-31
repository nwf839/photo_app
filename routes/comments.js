'use strict';

var comments = require('../controllers/comments.js');

module.exports = function(app, ensureAuthenticated) {
    app.get('/comments/:id', ensureAuthenticated, comments.getComments);
    app.post('/commentsOfPhoto/:photoId', ensureAuthenticated, comments.addComment);
}

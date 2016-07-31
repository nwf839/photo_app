'use strict';

var photos = require('../controllers/photos.js');

module.exports = function(app, ensureAuthenticated) {
    app.get('/photosOfUser/:id', ensureAuthenticated, photos.getPhotos);
    app.post('/photos/new', ensureAuthenticated, photos.addPhoto);
}

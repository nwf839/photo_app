'use strict';

var photos = require('../controllers/photos.js'),
    express = require('express'),
    ensureAuthenticated = require('../middleware/ensureAuthenticated.js'),
    router = express.Router();

module.exports = (function() {
    router.get('/photosOfUser/:id', ensureAuthenticated, photos.getPhotos);
    router.post('/photos/new', ensureAuthenticated, photos.addPhoto);
    return router;
})();

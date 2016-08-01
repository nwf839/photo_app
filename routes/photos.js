'use strict';

var photos = require('../controllers/photos.js'),
    express = require('express'),
    ensureAuthenticated = require('../middleware/ensureAuthenticated.js'),
    router = express.Router();

module.exports = (function() {
    router.get('/photosOfUser/:id', photos.getPhotos);
    router.post('/photos/new', photos.addPhoto);
    router.delete('/photo/:id', photos.deletePhoto);
    return router;
})();

var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    Photo = require('../schema/photo.js'),
    comments = require('./comments.js'),
    copyMongoDoc = require('../helpers/copyMongoDoc.js'),
    respondOnSuccess = require('../helpers/respondOnSuccess.js'),
    resize = require('easyimage').resize,
    fs = Promise.promisifyAll(require('fs')),
    bodyparser = require('body-parser');
    multer = require('multer'),
    processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto'),
    path = require('path'),
    // TEMPORARY PLACEHOLDER FIX
    photosDir = path.join(__dirname, '../assets/images/');

module.exports.getPhotos = function(request, response, next) {
    console.log(request.params);
    Photo.findPhotosByUserId(request.params.id)
        .then(copyMongoDoc)
        .then(function(photos) {
            console.log(photos);
            return Promise.map(photos, comments.modifyComments.bind(null, next));
        }).then(respondOnSuccess.bind(null, response))
        .catch(next);
};

module.exports.addPhoto = function(request, response, next) {
    processFormBody(request, response, function(err) {
        if (!request.file) {
            var err = new Error('No file sent with request');
            err.status = 400;
        }
        if (err) throw err;
        // request.file has the following properties of interest
        //      fieldname:      - Should be 'uploadedphoto' since that is what we sent
        //      originalname:   - The name of the file the user uploaded
        //      mimetype:       - The mimetype of the image (e.g. 'image/jpeg', or 'image/png'
        //      buffer:         - A node Buffer containing the contents of the file
        //      size:           - The size of the file in bytes

        // XXX - Do some validation here
        // We need to create the file in the directory "images" under a unique name. We make
        // the original file name unique by adding a unique prefix with a timestamp
        var timestamp = new Date().valueOf();
        var photo = {
            timestamp: timestamp,
            filename: 'U' + String(timestamp) + request.file.originalname,
            thumbnail: 'thumbnail.' + String(timestamp) + request.file.originalname,
            user_id: request.user._id
        }
        
        fs.writeFileAsync(photosDir + photo.filename, request.file.buffer)
            .then(function() {
                resize({
                    src: photosDir + photo.filename,
                    dst: photosDir + photo.thumbnail,
                    width: 200
                });
            }).then(function() {
                return Photo.create(photo);
            }).then(respondOnSuccess.bind(null, response))
                .catch(next);
    });
};

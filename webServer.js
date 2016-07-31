"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var Promise = require('bluebird');
var mongoose = require('mongoose');
var async = require('async');
var fs = Promise.promisifyAll(require('fs'));

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var comments = require('./controllers/comments.js');
var photos = require('./controllers/photos.js');
var users = require('./controllers/users.js');
var admin = require('./controllers/admin.js');

var logger = require('morgan');
var express = require('express');
var redis = require('redis');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var client = redis.createClient();
var passport = require('passport');
var multer = require('multer');
var processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');
var app = express();
var ensureAuthenticated = function(request, response, next) {
    if (request.isAuthenticated()) return next();
    var err = new Error('Authentication Failed');
    err.status = 401;
    return next(err);
};

require('mongoose').Promise = Promise;
require('./config/passport.js')(passport);
mongoose.connect('mongodb://localhost/cs142project6');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
    app.use(express.static(__dirname));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(session({
        //cookie: {maxAge: 3600000},
        secret: 'aIntNoBOdygonGeTDis', 
        store: new redisStore({host: 'localhost', port: 6379, client: client, ttl: 260}),
        resave: false,
        saveUninitialized: false,
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(function(err, request, response, next) {
        response.status(err.status || 500).send(err);
        next();
    });

app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});


require('./routes/index.js')(app, passport, ensureAuthenticated);

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});

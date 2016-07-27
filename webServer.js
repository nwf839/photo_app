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

var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var password = require('./cs142password.js');

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var redis = require('redis');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var client = redis.createClient();
var passport = require('passport');
var LocalStrategy = require('passport-local');
var multer = require('multer');
var processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');
var resize = require('imageMagick').resize;
var app = express();

require('mongoose').Promise = Promise;
mongoose.connect('mongodb://localhost/cs142project6');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: 'aIntNoBOdygonGeTDis', 
    store: new redisStore({host: 'localhost', port: 6379, client: client, ttl: 260}),
    resave: false,
    saveUninitialized: false
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

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.count({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response, next) {
    var respond = sendResponse.bind(null, response),
    getPhotoCounts = function() {
        return Photo.getPhotoCounts();
    },
    getCommentCounts = function() {
        return Photo.getCommentCounts();
    },
    fetchData = function(result) {
        return Promise.all([branch(getPhotoCounts, result), branch(getCommentCounts, result)])
            // XXX HACK: Promise.all used to allow parallel processing of model, but returns
            //           a copy of the model for each branch. There is most likely a more elegant
            //           way of doing this, possible by not returning this part at all...
            .then(function(result) {
                return result[0];
            });
    },
    branch = function(srcFn, result) {
        return srcFn()
            .then(copyDoc)
            .then(merge.bind(null, result));
    },
    merge = function(targArray, srcArray) {
        var key = Object.keys(srcArray[0])[1];
        return map(function(elem) {
            var i;
            var found = false;
            for (i = 0; i < srcArray.length; i++) {
                if (elem._id === srcArray[i]._id) {
                    found = true;
                    break;
                }
            }
            if (found === true) elem[key] = srcArray[i][key];
            else elem[key] = 0;
            return elem;
        }, targArray);
                 
    };

    User.generateUserList()
        .then(copyDoc)
        .then(fetchData)
        .then(respond)
        .catch(next);
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response, next) {
    var id = request.params.id,
        respond = sendResponse.bind(null, response),
        fetchUser = function(id) {
            return User.findUserById(id, '_id first_name last_name location occupation description');
        };

    Promise.resolve(isAuthorized(request, id))
        .then(userIdIsValid)
        .then(fetchUser)
        .then(userQueryIsValid)
        .then(respond)
        .catch(next);
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response, next) {
    // id extracted from routing parameters
    var id = request.params.id,

        fetchPhotos = function(id) {
            return Photo.findPhotosByUserId(id);
        },
        fetchUser = function(id) {
            return User.findUserById(id, '_id first_name last_name');
        },
        respond = sendResponse.bind(null, response),
        // Array.map method wrapper converts elements to promises that need to be resolved before returning a result
        mapPhotos = function(photos) {
            var modify = modifyComments.bind(null, next);
            return map(modify, photos);
        };

    Promise.resolve(isAuthorized(request, id))
        .then(fetchPhotos)
        .then(copyDoc)
        .then(mapPhotos)
        .then(respond)
        .catch(next);
});

app.get('/comments/:id', function(request, response, next) {
    var id = request.params.id,
            return Photo.getCommentsByUserId(id);
        };
        
    Promise.resolve(isAuthorized(request, id))
        .then(fetchComments)
        .then(respond)
        .catch(next);
});

app.post('/admin/login', function(request, response, next) {
    passport.use(new LocalStrategy(username, password, done) {
    var loginObj = request.body,
        respond = sendResponse.bind(null, response),
        updateSession = function(user) {
            request.session.user = user;
            return user;
        },
        checkPassword = function(passwordEntry) {
            if (password.doesPasswordMatch(passwordEntry.password_digest, passwordEntry.salt, loginObj.password) === false) {
                var err = new Error('invalid password');
                err.status = 400;
                throw err;
            } else return User.findUserById(passwordEntry._id);
        },

    User.getPasswordEntryFromUsername(loginObj.login_name)
        .then(checkPassword)
        .then(userQueryIsValid)
        .then(updateSession)
        .then(respond)
        .catch(next);
    });
});

app.post('/admin/logout', function(request, response, next) {
    var updateSession = function(request) {
        request.session.user = null;
        return null;
    }

    Promise.resolve(updateSession(request))
        .then(sendResponse.bind(null, response))
        .catch(next);
});

app.post('/admin/register', function(request, response, next) {
    var checkForUsername = function() {
                if (User.userExists(request.body.login_name) === true) {
                    var err = new Error('Username Already Exists');
                    err.status = 400;
                    throw err;
                } else {
                    return request.body.password;
                }
            },
    registerUser = function(passwordEntry) {
        request.body.salt = passwordEntry.salt;
        request.body.password_digest = passwordEntry.hash;
        delete request.body.password;
        var user = new User(request.body);
        user.save();
        return user;
    },
    respond = sendResponse.bind(null, response);

    Promise.resolve(checkForUsername())
        .then(password.makePasswordEntry)
        .then(registerUser)
        .then(respond)
        .catch(next);
});

app.post('/commentsOfPhoto/:photoId', function(request, response, next) {
    var id = request.params.photoId,
        comment = {
            comment: request.body.comment,
            date_time: new Date(),
            user_id: request.session.user._id
        },
        respond = sendResponse.bind(null, response);

    Photo.findByIdAndUpdate(id, {$push: {'comments': comment}}, {new: true}).exec()
        .then(copyDoc)
        .then(modifyComments.bind(null, next))
        .then(respond)
        .catch(next)
});

app.post('/photos/new', function(request, response, next) {
    processFormBody(request, response, function(err) {
        console.log(request.session);
        if (!request.file) {
            var err = new Error('No file sent with request');
            err.status = 400;
        }
        if (err) throw err;
        var respond = sendResponse.bind(null, response);
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
        var filename = 'U' + String(timestamp) + request.file.originalname;
        var thumbnail = 'thumbnail.' + filename;
        var createPhoto = function() {
            var photo = new Photo({file_name: filename, thumbnail: thumbnail,  date_time: new Date(), user_id: request.session.user._id});
            console.log(photo);
            photo.save();
        };
        var writeFiles = function(path, filename, thumbnail, buffer) {
            return new Promise(function(resolve, reject) {
                fs.writeFile(path + filename, buffer, function(err) {
                    if (err) reject(err);
                    resize({srcPath: path + filename, dstPath: path + thumbnail, width: 200}, function(err, stdout, stderr) {
                        if (err) reject(err);
                    });
                    resolve(filename);
                });
            });
        };

        writeFiles("./images/", filename, thumbnail, request.file.buffer)
            .then(createPhoto)
            .then(respond)
            .catch(next);
    });
});

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
    


var userQueryIsValid = function(result) {
    if (result === null) {
        var err = new Error('User does not exist');
        err.status = 400;
        throw err;
    } else return result;
}

var isAuthorized = function(request, id) {
    if (typeof request.session.user === 'undefined' || request.session.user === null) {
        var err = new Error('Unauthorized');
        err.status = 401;
        throw err;
    } else return id;
}

var userIdIsValid = function(id) {
    if (id === null) return null;
    if (mongoose.Types.ObjectId.isValid(id) === false) {
        var err = new Error('Invalid user id');
        err.status = 400;
        throw err;
    }
    return id;
}

var sendResponse = function(response, data) {
    response.status(200).send(data);
}
// Function that creates a modifiable copy of a document fetched from mongodb
var copyDoc = function(doc) {
    return JSON.parse(JSON.stringify(doc));
}

var map = function(mapFn, collection) {
    return Promise.all(collection.map(mapFn));
}

var modifyComments = function(next, photo) {
    var build = buildComment.bind(null, next);
    return map(build, photo.comments)
        .then(function(result) {
            photo.comments = result;
            return photo;
        });
};

// Helper function that adds user data to the comment it is called on

var buildComment = function(next, comment) {
    var id = comment.user_id;
    return User.findUserById(id, '_id first_name last_name')
        .then(userQueryIsValid)
        .then(copyDoc)
        .then(function(user) {
            delete comment.user_id;
            comment.user = user;
            return comment;
        })
        .catch(next);
};

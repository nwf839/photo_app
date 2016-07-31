'use strict';

var test = require('../controllers/test.js');

module.exports = function(app) {
    app.get('/test/:p1', test.test);
};

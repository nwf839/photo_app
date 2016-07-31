'use strict';

module.exports = function(app, passport, ensureAuthenticated) {
    require('./admin.js')(app, passport);
    require('./users.js')(app, ensureAuthenticated);
    require('./photos.js')(app, ensureAuthenticated);
    require('./comments.js')(app, ensureAuthenticated);
    require('./test.js')(app);
};

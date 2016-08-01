module.exports = function(request, response, next) {
    if (request.isAuthenticated()) return next();
    var err = new Error('Authentication Failed');
    err.status = 401;
    return next(err);
};

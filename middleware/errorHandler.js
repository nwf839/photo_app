module.exports = function(err, request, response, next) {
    response.status(err.status || 500).send(err);
    next();
};

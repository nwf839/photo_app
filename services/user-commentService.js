services.factory('UserCommentsService', ['$resource', function($resource) {
    var resource = $resource('comments/:userId');
    var comments = [];

    return {
        getComments: function(userId) {
            return resource.get({userId: userId}).$promise
                .then(function(response) {
                    return response.toJSON();
                });
        }
    }
}]);

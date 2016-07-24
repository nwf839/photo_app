services.factory('UserCommentsService', ['$resource', function($resource) {
    var resource = $resource('comments/:userId');
    var comments = [];

    return {
        getComments: function(userId) {
            return resource.query({userId: userId}).$promise
        }
    }
}]);

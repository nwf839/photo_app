'use strict';

services.factory('AddCommentService', ['$resource', 'Session', function($resource, Session) {
    var resource = $resource('commentsOfPhoto/:photoId');

    return {
        addComment: function(photoId, comment) {
            if (Session.isLoggedIn() && comment !== '') {
                console.log(photoId);
                return resource.save({photoId: photoId}, comment).$promise
                    .then(function(response) {
                        return response.toJSON();
            });
        }
    }
    }
}]);

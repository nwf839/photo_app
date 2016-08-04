'use strict';

services.factory('AddCommentService', ['$resource',
    function($resource) {
        var resource = $resource('commentsOfPhoto/:photoId', {}, {
            update: {method: 'PUT'},
            get: {method: 'GET'}
        });

        return {
            getCommentPhoto: function(id) {
                return resource.get({photoId: id}).$promise
                    .then(function(result) {
                        return result.toJSON();
                    });
            },
            deletePhoto: function(id) {
                return resource.delete({photoId: id}).$promise
                    .then(function(result) {
                        return result.toJSON();
                    });
            },
            addComment: function(photo) {
                return resource.update({photoId: photo._id}, photo).$promise
                    .then(function(response) {
                        return response.toJSON();
                    });
            }
        }
    }
]);

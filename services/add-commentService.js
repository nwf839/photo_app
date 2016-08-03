'use strict';

services.factory('AddCommentService', ['$resource',
    function($resource) {
        var resource = $resource('commentsOfPhoto/:photoId', {}, {
            update: {method: 'PUT'},
            get: {method: 'GET'}
        });

        return {
            getCommentPhoto: function(id) {
                console.log(id);
                return resource.get({photoId: id}).$promise
                    .then(function(result) {
                        console.log(result);
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

'use strict';

services.factory('AddCommentService', ['$resource',
    function($resource) {
        var resource = $resource('commentsOfPhoto/:photoId', {}, {
            update: {method: 'PUT'}
        });

        return {
            addComment: function(photo) {
                console.log(photo);
                return resource.update({photoId: photo._id}, photo).$promise
                    .then(function(response) {
                        return response.toJSON();
                    });
            }
        }
    }
]);

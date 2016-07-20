'use strict';

services.factory('UserPhotosService', ['$resource', 'UserDetailService', function($resource, UserDetailService) {
        var resource = $resource('/photosOfUser/:id'),
            photos = [],
            userId = null,
            setPhotos = function(id, response) {
                return Promise.all(response.map(function(photo) {
                    return photo.toJSON();
                }))
                .then(getUserInfo.bind(null, id))
                .then(function(result) {
                    photos = result;
                    return photos;
                });
            },
            getUserInfo = function(id, response) {
                return UserDetailService.getUser(id)
                    .then(function(result) {
                        response.userInfo = 'Photos of ' + result.first_name + ' ' + result.last_name;
                        return response;
                    });
            };

        return {
            getPhotos: function(id) {
                //if (userId === id) return Promise.resolve(photos);
                //else {
                    return resource.query({id: id}).$promise
                        .then(setPhotos.bind(null, id));
                //}
            },
            resetPhotos: function(id) {
                return resource.query({id: id}).$promise
                    .then(setPhotos.bind(null, id));
            }
            //clearPhotos: function() {
            //    photos = [];
            //    userId = null;
            //},
        }   
}]);

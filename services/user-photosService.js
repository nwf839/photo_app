'use strict';

services.factory('UserPhotosService', ['$resource',// 'UserDetailService', 
    function($resource) {//, UserDetailService) {
        var resource = $resource('/photosOfUser/:id'), 
        photos = [],
        setPhotos = function(response) {
            //var photoArray = response.toJSON();
            angular.forEach(response, function(photo) {
                photos.push(photo.toJSON());
            });
            return photos;
        };
                /*userId = null,
        setPhoto = function(id, response) {
            return Promise.resolve(response.toJson())
                .then(getUserInfo.bin(null, id))
                .then(function(result) {
                    photo = result;
                    return photo;
                });
        },
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
        };*/

        return {
            getPhotos: function(id) {
                //if (userId === id) return Promise.resolve(photos);
                //else {
                    return resource.query({id: id}).$promise
                        .then(setPhotos);
                //}
            },
            deletePhotos: function(id) {
                return resource.delete({id: id}).$promise
                    .then(setPhotos);
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

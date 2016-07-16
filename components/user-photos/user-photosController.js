'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams', 'UserPhotosService', 'AddCommentService', 'Session',
  function($scope, $routeParams, UserPhotosService, AddCommentService, Session) {
    /*
     * Since the route is specified as '/photos/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId,
        fetchPhotos = function() {
            return UserPhotosService.getPhotos(userId)
                .then(setPhotoModel);
        },
        setPhotoModel = function(photos) {
            $scope.userPhotos.photos = photos;
            $scope.main.selectedUser = photos.userInfo;
            angular.forEach($scope.userPhotos.photos, function() {
                $scope.userPhotos.comments.push({comment: ''});
            });
        },
        replacePhoto = function(index, photo) {
                $scope.userPhotos.photos[index] = photo;
                $scope.userPhotos.comments = [];
                return userId;
        };

    $scope.userPhotos = {};
    $scope.userPhotos.photos = [];
    $scope.userPhotos.comments = [];

    $scope.addComment = function(photoId, pIndex) {
        return AddCommentService.addComment(photoId, $scope.userPhotos.comments[pIndex])
            .then(replacePhoto.bind(null, pIndex))
            .then(UserPhotosService.resetPhotos);
    };

    fetchPhotos();

    $scope.$watch('userPhotos.photos', function(newValue, oldValue) {
        if (newValue !== oldValue) $scope.userPhotos.photos = newValue;
    });
}]);

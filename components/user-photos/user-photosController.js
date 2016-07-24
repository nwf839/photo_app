'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$state', '$stateParams', 'photoData', 'AddCommentService', 'UserPhotosService',
    function($scope, $state, $stateParams, photoData, AddCommentService, UserPhotosService) {
        var userId = $stateParams.userId,
                replacePhoto = function(index, photo) {
                    $scope.userPhotos.photos[index] = photo;
                    $scope.userPhotos.comments[index].comment = '';
                    return userId;
            };
        
        $scope.userPhotos = $scope.userPhotos || photoData;

        $scope.userPhotos.addComment = function(photoId, pIndex) {
            return AddCommentService.addComment(photoId, $scope.userPhotos.comments[pIndex])
                .then(replacePhoto.bind(null, pIndex))
                .then(UserPhotosService.getPhotos);
        };

        $scope.$watch('userPhotos.photos', function(newValue, oldValue) {
            if (newValue !== oldValue) $scope.userPhotos.photos = newValue;
        });

        $scope.$watch('main.advancedFeatures.enabled', function(newValue, oldValue) {
            if (newValue !== oldValue) $state.go('photos.display', {advancedFeatures: newValue});
        });
}]);

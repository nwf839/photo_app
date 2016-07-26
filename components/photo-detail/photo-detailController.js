'use strict';

cs142App.controller('PhotoDetailController', ['$scope', '$stateParams', 'AddCommentService', function($scope, $stateParams, AddCommentService) {
    var photoId = $stateParams.photoId,
        index = $scope.userPhotos.ids.indexOf(photoId),
        replacePhoto = function(photo) {
            $scope.userPhotoDetail.photo = photo;
            $scope.userPhotoDetail.comment = '';
        };

    $scope.userPhotoDetail = {};
    $scope.userPhotoDetail.photo = $scope.userPhotos.photos[index];
    $scope.userPhotoDetail.commentModel = $scope.userPhotos.comments[index];
    $scope.userPhotoDetail.addComment = function() {
        return AddCommentService.addComment(photoId, $scope.userPhotoDetail.commentModel)
            .then(replacePhoto);
    };

    $scope.$watch('userPhotoDetail.photo', function(newValue, oldValue) {
        if (newValue !== oldValue) $scope.userPhotoDetail.photo = newValue;
    });
}]);

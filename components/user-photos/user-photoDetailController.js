'use strict';

cs142App.controller('UserPhotoDetailController', ['$scope', '$stateParams', function($scope, $stateParams) {
    var photoId = $stateParams.photoId,
        index = $scope.userPhotos.ids.indexOf(photoId);
    $scope.userPhotoDetail = {};
    $scope.userPhotoDetail.photo = $scope.userPhotos.photos[index];
    $scope.userPhotoDetail.comment = $scope.userPhotos.comments[index];
    $scope.userPhotoDetail.addComment = $scope.userPhotos.addComment.bind(null, photoId, index);
}]);

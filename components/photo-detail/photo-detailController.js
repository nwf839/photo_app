'use strict';

cs142App.controller('PhotoDetailController', ['$scope', '$state', 'AddCommentService', 'photoDetail', function($scope, $state, AddCommentService, photoDetail) {
    var replacePhoto = function(photo) {
        $scope.photoDetail.photo = photo;
        $scope.photoDetail.comment = '';
    };

    $scope.photoDetail = photoDetail;
    $scope.photoDetail.addComment = function() {
        return AddCommentService.addComment(photoId, $scope.photoDetail.commentModel)
            .then(replacePhoto);
    };

    console.log($scope.photoDetail);
    $scope.$watch('photoDetail.photo', function(newValue, oldValue) {
        if (newValue !== oldValue) $scope.photoDetail.photo = newValue;
    });
    

    // XXX Setting parent scope variable, may be unnecessary...
    $scope.main.curIndex = $scope.photoDetail.photoIndex;

    $scope.select = function(index) {
        $scope.main.curIndex = index;
        $state.go('.', {photoId: $scope.photoDetail.ids[index]});
    };

    $scope.next = function() {
        if ($scope.main.curIndex < $scope.photoDetail.ids.length - 1) $scope.select($scope.main.curIndex + 1);
    };

    $scope.prev = function() {
        if ($scope.main.curIndex > 0) $scope.select($scope.main.curIndex - 1);
    };
}]);

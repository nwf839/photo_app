'use strict';

cs142App.controller('PhotoDetailController', ['$scope', '$state', 'AddCommentService', 'photoDetail', 'Session', 'list', '$interval',
    function($scope, $state, AddCommentService, photoDetail, Session, list, $interval) {
    var replacePhoto = function(photo) {
        $scope.photoDetail.photo = photo;
        $scope.photoDetail.commentModel.comment = '';
    };

    $scope.photoDetail = photoDetail;
    $scope.photoDetail.addComment = function() {
        return AddCommentService.addComment($scope.photoDetail.photo._id, $scope.photoDetail.commentModel)
            .then(replacePhoto);
    };

    $scope.photoDetail.userList = list;
    angular.forEach($scope.photoDetail.userList, function(item) {
        item.label = item.first_name + ' ' + item.last_name;
    });
    // XXX Would probably make more sense bound to main scope
    $scope.photoDetail.user = Session.getUser();

    $scope.commentIsEmpty = true;

    $scope.$watch('photoDetail.photo', function(newValue, oldValue) {
        if (newValue !== oldValue) $scope.photoDetail.photo = newValue;
    });
    
    $scope.$watch('photoDetail.commentModel.comment', function(newValue, oldValue) {
        if (newValue !== oldValue) $scope.commentIsEmpty = (newValue === '');
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

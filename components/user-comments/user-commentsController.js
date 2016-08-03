cs142App.controller('UserCommentsController', ['$scope', 'comments', function($scope, comments) {
    $scope.userComments = {};
    $scope.userComments.commentedPhotos = comments;
}]);

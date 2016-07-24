cs142App.controller('UserCommentsController', ['$scope', 'comments', function($scope, comments) {
    $scope.userComments.comments = comments;
};

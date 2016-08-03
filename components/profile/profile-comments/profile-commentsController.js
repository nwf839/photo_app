cs142App.controller('ProfileCommentsController', ['$scope', 'commentData',
    function($scope, commentData) {
        $scope.commentsProfile = {};
        $scope.commentsProfile.comments = commentData;
    }
]);

cs142App.controller('ProfileCommentsController', ['$scope', 'commentData', 'deleteComment', 'getCommentPhoto', 'getComments',
    function($scope, commentData, deleteComment, getCommentPhoto, getComments) {
        $scope.commentsProfile = commentData;
        $scope.getCommentPhoto = getCommentPhoto;
        $scope.deleteComment = function(commentIndex, photoId, userId) {
            $scope.getCommentPhoto(photoId)
                .then(function(photo) {
                    console.log(photo);
                    photo.comments.splice(commentIndex, 1);
                    return photo;
                }).then(deleteComment)
                .then(getComments.bind(null, userId))
                .then(function(result) {
                    $scope.commentsProfile.commentedPhotos = result;
                });
        };

        $scope.showIcon = function(id) {
            $scope.commentsProfile.iconIsVisible[id] = true;
        };

        $scope.hideIcon = function(id) {
            $scope.commentsProfile.iconIsVisible[id] = false;
        };
    }
]);

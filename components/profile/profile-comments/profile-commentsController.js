cs142App.controller('ProfileCommentsController', ['$scope', '$mdDialog', 'commentData', 'deleteComment', 'getCommentPhoto', 'getComments',
    function($scope, $mdDialog, commentData, deleteComment, getCommentPhoto, getComments) {
        $scope.commentsProfile = commentData;
        $scope.getCommentPhoto = getCommentPhoto;
        var deleteCom = function(commentIndex, photoId, userId) {
            $scope.getCommentPhoto(photoId)
                .then(function(photo) {
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

        $scope.showDialog = function(ev, commentIndex, photoId, userId) {
                var confirm = $mdDialog.confirm()
                    .title('Are you sure you want to delete this comment?')
                    .textContent('To ignore, press "Cancel"')
                    .ariaLabel('Comment Delete Confirmation')
                    .targetEvent(ev)
                    .cancel('Cancel')
                    .ok('Delete')
                $mdDialog.show(confirm).then(function() {
                    deleteCom(commentIndex, photoId, userId);
                });
        };
    }
]);

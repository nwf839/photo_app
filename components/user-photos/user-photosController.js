'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$state', '$stateParams', 'photoData', 'AddCommentService', 'UserPhotosService',//'$stateParams', 'UserPhotosService', 'AddCommentService', 'Session',
  function($scope, $state, $stateParams, photoData, AddCommentService, UserPhotosService) {//$stateParams, UserPhotosService, AddCommentService, Session) {
    /*
     * Since the route is specified as '/photos/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $stateParams.userId,
        /*fetchPhotos = function() {
            return UserPhotosService.getPhotos(userId)
                .then(setPhotoModel);
        },
        setPhotoModel = function(photos) {
            $scope.userPhotos.photos = photos;
            $scope.main.selectedUser = photos.userInfo;
            angular.forEach($scope.userPhotos.photos, function(photo) {
                $scope.userPhotos.comments.push({comment: ''});
                $scope.userPhotos.routes.push('photos.displayOne({photoId:' + photo._id + '})');
            });
        },*/
        replacePhoto = function(index, photo) {
                $scope.userPhotos.photos[index] = photo;
                $scope.userPhotos.comments[index].comment = '';
                return userId;
        };
        /*routeToState = function(routes, featureFlag) {
            if (featureFlag === true && routes.length > 0) $state.go(routes[0]);
            else {
                console.log($scope.userPhotos);
                $state.go('.displayAll');
            }
        };*/

    $scope.userPhotos = photoData;//$scope.userPhotos || photoData;

    $scope.addComment = function(photoId, pIndex) {
        return AddCommentService.addComment(photoId, $scope.userPhotos.comments[pIndex])
            .then(replacePhoto.bind(null, pIndex))
            //.then(UserPhotosService.getPhotos);
    };


    //routeToState($scope.userPhotos.routes, $scope.main.advancedFeatures.enabled);
    //fetchPhotos();

    $scope.$watch('userPhotos.photos', function(newValue, oldValue) {
        if (newValue !== oldValue) $scope.userPhotos.photos = newValue;
    });

    $scope.$watch('main.advancedFeatures.enabled', function(newValue, oldValue) {
        //if (newValue !== oldValue) routeToState($scope.userPhotos.routes, newValue);
    });
}]);

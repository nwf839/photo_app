'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$state', 'photoData',
    function($scope, $state, photoData) {        
        $scope.userPhotos = photoData;
        $scope.main.selectedUser = photoData.selectedUser;

        $scope.$watch('userPhotos.photos', function(newValue, oldValue) {
            if (newValue !== oldValue) $scope.userPhotos.photos = newValue;
        });

        
        
        $scope.curIndex = 0;

        $scope.select = function(index) {
            $scope.curIndex = index;
            $state.go('.', {photoId: $scope.userPhotos.ids[index]});
        };

        $scope.next = function() {
            if ($scope.curIndex < $scope.userPhotos.ids.length - 1) $scope.select($scope.curIndex + 1);
        };

        $scope.prev = function() {
            if ($scope.curIndex > 0) $scope.select($scope.curIndex - 1);
        };
    }
]);

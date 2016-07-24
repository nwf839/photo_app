'use strict';

directives.directive('paPhotoViewer', [function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            photoIds: '=',
            show: '='
        },
        controller: ['$scope', '$state', function($scope, $state) {
            $scope.curIndex = 0;

            $scope.select = function(index) {
                $scope.curIndex = index;
                $state.go('.', {photoId: $scope.photoIds[index]});
            };

            $scope.next = function() {
                if ($scope.curIndex < $scope.photoIds.length - 1) $scope.select($scope.curIndex + 1);
            };

            $scope.prev = function() {
                if ($scope.curIndex > 0) $scope.select($scope.curIndex - 1);
            };
        }],
        templateUrl: 'directives/paPhotoViewer/paPhotoViewerTemplate.html'
    }
}]);

'use strict';

directives.directive('paPhotoViewer', [function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            showAll: '=',
            photos: '='
        },
        controllerAs: 'photoViewerCtrl',
        bindToController: true,
        controller: ['$scope', function($scope) {
            var photoViewerCtrl = this;
            //$scope.init = function() {
            //    angular.forEach(photoViewerCtrl.photos, function(photo) {
            //        $scope.panes
            $scope.show = photoViewerCtrl.showAll.enabled;
            $scope.panes = [];
            photoViewerCtrl.selectedIndex = null;
            photoViewerCtrl.lastIndex = null;
            photoViewerCtrl.update = function(pane) {
                if (pane.index === $scope.panes.length) photoViewerCtrl.addPane(pane);
                else photoViewerCtrl.replacePane(pane);
                $scope.select(photoViewerCtrl.selectedIndex);
            };

            photoViewerCtrl.addPane = function(pane) {
                console.log(pane);
                if ($scope.panes.length === 0) {
                    photoViewerCtrl.selectedIndex = photoViewerCtrl.lastIndex = 0;
                    pane.active = true;
                }
                $scope.panes.push(pane);
                console.log($scope.panes);
            };

            photoViewerCtrl.replacePane = function(pane) {
                $scope.panes[pane.index] = pane;
            };

            $scope.select = function(index) {
                photoViewerCtrl.lastIndex = photoViewerCtrl.selectedIndex;
                photoViewerCtrl.selectedIndex = index;
                $scope.panes[photoViewerCtrl.lastIndex].active = false;
                $scope.panes[photoViewerCtrl.selectedIndex].active = true;
            };

            $scope.toggleVisibility = function() {
                angular.forEach($scope.panes, function(pane) {
                    pane.active = !$scope.show;
                });
            };

            $scope.next = function() {
                if (photoViewerCtrl.selectedIndex < photoViewerCtrl.panes.length - 1) $scope.select(photoViewerCtrl.selectedIndex + 1);
            };

            $scope.prev = function() {
                if (photoViewerCtrl.selectedIndex > 0) $scope.select(photoViewerCtrl.selectedIndex - 1);
            };

            $scope.getSelectedIndex = function() {
                return photoViewerCtrl.selectedIndex;
            };
        }],
        link: function(scope, element, attributes, controller) {
            scope.$watch(function() {
                return controller.showAll.enabled;
            }, function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    var index = scope.getSelectedIndex() || 0;
                    scope.show = newValue;
                    scope.toggleVisibility();
                    scope.select(index);
                }
            });
        },
        templateUrl: 'directives/paPhotoViewer/paPhotoViewerTemplate.html'
    }
}]);

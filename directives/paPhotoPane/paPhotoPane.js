'use strict';

directives.directive('paPhotoPane', [function() {
    return {
        require: '^^paPhotoViewer',
        restrict: 'E',
        templateUrl: 'directives/paPhotoPane/paPhotoPaneTemplate.html',
        transclude: true,
        scope: {
            photoId: '@'
        },
        link: function(scope, element, attributes, controller) {
            scope.active = false;
            scope.route = 'photos.detail({photoId: photoId})';
            controller.update(scope);
        }
    }
}]);

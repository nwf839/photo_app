'use strict';

directives.directive('paPhotoPane', [function() {
    return {
        require: '^^paPhotoViewer',
        restrict: 'E',
        templateUrl: 'directives/paPhotoPane/paPhotoPaneTemplate.html',
        transclude: true,
        scope: {
            index: '='
        },
        link: function(scope, element, attributes, controller) {
            scope.active = false;
            controller.update(scope);
        }
    }
}]);

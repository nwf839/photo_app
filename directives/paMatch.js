'use strict';

directives.directive('ngMatch', ['$parse', function($parse) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elem, attrs, ctrl) {
            if (!ctrl) return;
            if (!attrs['ngMatch']) return;

            var firstPassword = $parse(attrs['ngMatch']);
            var validator = function(value) {
                var tmp = firstPassword(scope),
                    valid = value === tmp;
                ctrl.$setValidity('match', valid);
                return value;
            };

            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);
            attrs.$observe('ngMatch', function() {
                validator(ctrl.$viewValue);
            });
        }
    }
}]);

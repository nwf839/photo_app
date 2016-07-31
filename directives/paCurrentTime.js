directives.directive('paCurrentTime', ['$interval', 'dateFilter', function($interval, dateFilter) {
    return function(scope, element, attrs) {
        var stopTime;

        function updateTime() {
            element.text(dateFilter(new Date(), 'MM/dd/yyyy @ h:mma'));
        }

        updateTime();
        
        // XXX Maybe change this so it syncs with clock and updates every minute
        stopTime = $interval(updateTime, 1000);

        element.on('$destroy', function() {
            $interval.cancel(stopTime);
        });
    }
}]);

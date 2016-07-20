'use strict';

cs142App.controller('UserDetailController', ['$scope', 'user', //'$stateParams', 'UserDetailService', //'$resource',
  function ($scope, user) {
      //$stateParams, UserDetailService) {//$resource) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    /*var userId = $stateParams.userId;
    $scope.user = {};
    $scope.user.model = {};

    UserDetailService.getUser(userId)
        .then(function(user) {
            $scope.user.model = user;
            $scope.main.selectedUser = user.first_name + ' ' + user.last_name;
        });

    $scope.$watch('user.model', function(newValue, oldValue) {
        if (newValue !== oldValue) $scope.user.model = newValue;
    });*/
      

    $scope.user = {};
    $scope.user.model = user;
  }
]);

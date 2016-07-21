'use strict';

cs142App.controller('UserDetailController', ['$scope', 'user',
  function ($scope, user) {
    $scope.user = {};
    $scope.user.model = user;
  }
]);

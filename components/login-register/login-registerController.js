'use strict';

cs142App.controller('LoginRegisterController', ['$scope', 'Session',
  function($scope, Session) {
      $scope.main.selectedUser = '';
      $scope.displayLogin = true;
      $scope.switchForm = function() {
          $scope.displayLogin = !$scope.displayLogin;
      };
     
      $scope.login = Session.login;
      $scope.register = function(user) {
          Session.register(user);
      };

      $scope.curUser = {};
      $scope.curUser.username = '';
      $scope.curUser.password = '';

      $scope.newUser = {};
      $scope.newUser.username = '';
      $scope.newUser.password = '';
      $scope.passwordValidation = '';
      $scope.newUser.first_name = '';
      $scope.newUser.last_name = '';
      $scope.newUser.location = '';
      $scope.newUser.description = '';
      $scope.newUser.occupation = '';
  }
]);

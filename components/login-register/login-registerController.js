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
          Session.register(user)
              .then(Session.login);
      };

      $scope.curUser = {};
      $scope.curUser.login_name = '';
      $scope.curUser.password = '';

      $scope.newUser = {};
      $scope.newUser.login_name = '';
      $scope.newUser.password = '';
      $scope.passwordValidation = '';
      $scope.newUser.first_name = '';
      $scope.newUser.last_name = '';
      $scope.newUser.location = '';
      $scope.newUser.description = '';
      $scope.newUser.occupation = '';
  }
]);

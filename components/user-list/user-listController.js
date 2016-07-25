'use strict';

cs142App.controller('UserListController', ['$rootScope', '$scope', '$state', 'list', 'updateList',
    function ($rootScope, $scope, $state, list, updateList) {
        $scope.main.title = 'Users';
        $scope.main.selectedUser = '';
        $scope.userList = {};
        $scope.userList.users = list;

        $rootScope.$on('newUser', function() {
            updateList()
                .then(function(result) {
                    $scope.userList.users = result;
                });
        });
    }]);

'use strict';

cs142App.controller('UserListController', ['$rootScope', '$scope', '$state', 'listData', 'updateList',
    function ($rootScope, $scope, $state, listData, updateList) {
        $scope.main.title = 'Users';
        $scope.main.selectedUser = '';
        $scope.userList = listData;
        console.log($scope.userList.isExpanded);

        $scope.showButton= function(id) {
            $scope.userList.isExpanded[id] = true;
        };

        $scope.hideButton= function(id) {
            $scope.userList.isExpanded[id] = false;
        };

        $rootScope.$on('newUser', function() {
            updateList()
                .then(function(result) {
                    $scope.userList.users = result;
                });
        });

        $rootScope.$on('sessionChanged', function() {
            updateList()
                .then(function(result) {
                    $scope.userList.users = result;
                });
        });
    }]);

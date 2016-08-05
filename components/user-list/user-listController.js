'use strict';

cs142App.controller('UserListController', ['$rootScope', '$scope', '$state', 'listData', 'updateList',
    function ($rootScope, $scope, $state, listData, updateList) {
        $scope.main.title = 'Users';
        $scope.main.selectedUser = '';
        $scope.userList = listData;

        $scope.toggleView= function(id) {
            $scope.userList.isExpanded[id] = !$scope.userList.isExpanded[id];
        };

        $scope.hideButton= function(id) {
            $scope.userList.isExpanded[id] = false;
        };

        $rootScope.$on('newUser', function() {
            updateList()
                .then(function(result) {
                    $scope.userList.list = result;
                });
        });

        $rootScope.$on('sessionChanged', function() {
            updateList()
                .then(function(result) {
                    $scope.userList.list = result;
                });
        });
    }]);

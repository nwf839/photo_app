'use strict';

cs142App.controller('UserListController', ['$rootScope', '$scope', 'list', 'updateList',
    function ($rootScope, $scope, list, updateList) {
        $scope.main.title = 'Users';
        $scope.main.selectedUser = '';
        $scope.userList = {};
        $scope.userList.users = list;
        $rootScope.$on('newUser', updateList($scope.userList.users));
    }
]);

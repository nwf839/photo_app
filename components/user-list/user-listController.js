'use strict';

cs142App.controller('UserListController', ['$rootScope', '$scope', 'UserListService',
    function ($rootScope, $scope, UserListService) {
        $scope.main.title = 'Users';
        $scope.main.selectedUser = '';
        $scope.userList = {};
        $scope.userList.users = [];
        
        UserListService.getUserList()
            .then(function(users) {
                $scope.userList.users = users;
            });

        $rootScope.$on('newUser', function() {
            UserListService.reset()
                .then(function(users) {
                    $scope.userList.users = users;
                });
        });
    }
]);

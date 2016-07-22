'use strict';

cs142App.controller('UserListController', ['$rootScope', '$scope', '$state', 'list', 'updateList',
    function ($rootScope, $scope, $state, list, updateList) {
        $scope.main.title = 'Users';
        $scope.main.selectedUser = '';
        $scope.userList = {};
        $scope.userList.users = list;

        // XXX Placeholder models and population method to be used until webServer API
        // is updated
        $scope.userList.nPhotos = [];
        $scope.userList.nComments = [];
        angular.forEach(list, function() {
            // XXX May need to convert server data to strings either here or in the
            // resolve call
            $scope.userList.nPhotos.push('2');
            $scope.userList.nComments.push('5');
        });

        // XXX May need to be changed, but should serve for now
        $scope.goToUser = function(id) {
            $state.go('users.detail', {userId: id});
        };
        $scope.goToPhotos = function(id) {
            $state.go('photos.display', {userId: id});
        };
        $scope.goToComments = function(id) {
            console.log('Not Implemented Yet');
        };
        $rootScope.$on('newUser', updateList($scope.userList.users));
    }
]);

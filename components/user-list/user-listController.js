'use strict';

cs142App.controller('UserListController', ['$rootScope', '$scope', '$state', 'listData', 'updateList',
    function ($rootScope, $scope, $state, listData, updateList) {
        $scope.main.title = 'Users';
        $scope.main.selectedUser = '';
        $scope.userList = listData;

        
        $scope.print = function(index) {
            console.log($scope.userList.isExpanded[index]);
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

        var domSections = [];
        angular.forEach($scope.userList.isExpanded, function() {
            domSections.push(null);
        });
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        var options = {attributes: true};
        var handler = function(mutationRecords) {
            angular.forEach(mutationRecords, function(mutation) {
               var index = angular.element(mutation.target).scope().uIndex;
               var self = $(name=mutation.target);
               var parent = self.prev().children();
               if (domSections[index] === null) {
                   domSections[index] = parent.children("p").detach();
               } else {
                   domSections[index].appendTo(parent);
                   domSections[index] = null;
               }
            });
        };
        var observer = new MutationObserver(handler);

        $(document).ready(function() {
            $('.fab-panel').each(function() {
                observer.observe(this, options);
            });
       });
    }]);

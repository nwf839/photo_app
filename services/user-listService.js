'use strict';

cs142App.factory('UserListService', ['$resource', function($resource) {
    var resource = $resource('/user/list'),
        list = [],
        setList = function(response) {
            list = response.map(function(user) {
                return user.toJSON();
            });
            return list;
        }

    return {
        getUserList: function() {
            if (list.length !== 0) return Promise.resolve(list);
            else {
                return resource.query().$promise
                    .then(setList);
            }
        },
        reset: function() {
            list = [];
            return this.getUserList();
        }
    }
}]);

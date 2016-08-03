'use strict';

services.factory('UserDetailService', ['$resource', function($resource) {
        var user = {},
            userId = null,
            resource = $resource('/user/:id', {}, {
                get: {method: 'GET'},
                create: {method: 'POST'},
                update: {method: 'PUT'}
            }),
            setUser = function(response) {
                user = response.toJSON();
                userId = user._id;
                return user;
            };

        return {
            getUser: function(id) {
                //if (userId === id) return Promise.resolve(user);
                //else {
                    return resource.get({id: id}).$promise
                        .then(setUser);
                //}
            },
            updateUser: function(id, user) {
                return resource.update({id: id}, user).$promise
                    .then(setUser);
            }
            //clearUser: function() {
            //    user = {};
            //    userId = null;
            //}
        }
}]);

services.factory('Session', ['$rootScope', '$resource', '$location', 'UserDetailService', 'UserPhotosService',
        function($rootScope, $resource, $location, UserDetailService, UserPhotosService) {
            var user = {},
                loginResource = $resource('/admin/login'),
                logoutResource = $resource('/admin/logout'),
                registerResource = $resource('/admin/register'),
                loggedIn = false,
                setUser = function(response) {
                    user = response.toJSON();
                    loggedIn = (Object.keys(user).length !== 0);
                    if (loggedIn === false) $location.path('/login-register');
                    $rootScope.$emit('sessionChanged');
                },
                BroadcastNewUser = function(response) {
                    $rootScope.$emit('newUser');
                    var fullUser = response.toJSON(),
                        loginInfo = {};
                    loginObj.login_name = fullUser.login_name;
                    loginObj.password = fullUser.password;
                    return loginObj;
                };

            return {
                login: function(loginObj) {
                    if (loggedIn === false) {
                        loginResource.save(loginObj).$promise
                            .then(setUser);
                    }
                },
                logout: function() {
                    if (loggedIn === true) {
                        logoutResource.save({}).$promise
                            .then(setUser)
                            .then(UserDetailService.clearUser)
                            .then(UserPhotosService.clearPhotos);
                    }
                },
                register: function(newUser) {
                    if (loggedIn === false) {
                        return registerResource.save(newUser).$promise
                            .then(notifyOfNewUser)
                    }
                },
                getUserFirstName: function() {
                    if (loggedIn === true) return user.first_name;
                },
                getUser: function() {
                    if (loggedIn === true) return user;
                },
                isLoggedIn: function() {
                    return loggedIn;
                }
            }
        }]);

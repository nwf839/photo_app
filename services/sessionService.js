services.factory('Session', ['$rootScope', '$resource', '$state','$timeout', 'UserDetailService', 'UserPhotosService',
        function($rootScope, $resource, $state, $timeout, UserDetailService, UserPhotosService) {
            var user = {},
                loginResource = $resource('/admin/login', {}),
                logoutResource = $resource('/admin/logout', {}, {withCredentials: true}),
                registerResource = $resource('/admin/register'),
                loggedIn = false,
                setUser = function(response) {
                    user = response.toJSON();
                    loggedIn = (Object.keys(user).length !== 0);
                    if (loggedIn === false) $timeout($state.go('login-register.login'));
                    $rootScope.$emit('sessionChanged');
                },
                broadcastNewUser = function() {
                    $rootScope.$emit('newUser');
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
                            .then(broadcastNewUser);
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

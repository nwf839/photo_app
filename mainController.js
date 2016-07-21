'use strict';

angular.module('cs142App.core', ['ngMaterial', 'ngResource', 'ngMessages']);
var cs142App = angular.module('cs142App', ['ngRoute', 'ui.router', 'cs142App.core', 'cs142App.services', 'cs142App.directives']);

/*cs142App.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/users', {
                templateUrl: 'components/user-list/user-listTemplate.html',
                controller: 'UserListController'
            }).
            when('/login-register', {
                templateUrl: 'components/login-register/login-registerTemplate.html',
                controller: 'LoginRegisterController'
            }).
            when('/users/:userId', {
                templateUrl: 'components/user-detail/user-detailTemplate.html',
                controller: 'UserDetailController'
            }).
            when('/photos/:userId', {
                templateUrl: 'components/user-photos/user-photosTemplate.html',
                controller: 'UserPhotosController'
            }).
            otherwise({
                redirectTo: '/users'
            });
    }]);
*/

cs142App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider) {
    //$urlRouterProvider.deferIntercept();
    $urlRouterProvider.otherwise('/login-register/login');
    //$locationProvider.html5Mode({enabled: false});

    $stateProvider

        .state('root', {
            abstract: true,

            resolve: {
                userListService: 'UserListService',
                list: function(userListService) {
                    return userListService.getUserList();
                },
                // XXX Not sure if this will work...
                updateList: function(userListService) {
                    return function(model) {
                        userListService.reset()
                            .then(function(result) {
                                model = result;
                            })
                    }
                }
            },
            views: {
                '@' : {
                    templateUrl: 'photo-share-layout.html',
                    controller: 'MainController'
                },
                'top@root': { templateUrl: 'photo-share-top-nav.html' },
                'side@root': { 
                    templateUrl: 'components/user-list/user-listTemplate.html',
                    controller: 'UserListController'
                },
                'main@root': { templateUrl: 'photo-share-display-window.html' }
            }
        })
        
        .state('users', {
            parent: 'root',
            url: '/users',
            views: {
                'display@root': {
                    templateUrl: 'components/user-list/user-listTemplate.html',
                    controller: 'UserListController'
                }
            }
        })
        .state('users.detail', {
            url: '/:userId',
            resolve: {
                userDetailService: 'UserDetailService',
                user: function($stateParams, userDetailService) {
                    return userDetailService.getUser($stateParams.userId);
                }
            },
            views: {
                'display@root': {
                    templateUrl: 'components/user-detail/user-detailTemplate.html',
                    controller: 'UserDetailController'
                }
            }
            //templateUrl: 'components/user-detail/user-detailTemplate.html',
            //controller: 'UserDetailController'
        })


        .state('login-register', {
            parent: 'root',
            url: '/login-register',
            views: {
                'display@root': {
                    templateUrl: 'components/login-register/login-registerTemplate.html',
                    controller: 'LoginRegisterController'
                }
            }
        })
        .state('login-register.login', {
            url: '/login',
            //views: {
            //    'display@root': {
                    templateUrl: 'components/login-register/loginTemplate.html'
            //    }
            //}
        })
        .state('login-register.register', {
            url: '/register',
            //views: {
            //    'display@root': {
                    templateUrl: 'components/login-register/registerTemplate.html'
            //    }
            //}
        })


        /*.state('photos', {
            parent: 'root',
            abstract: true,
            url: '/photos',
            views: {
                'display@root': {
                    templateUrl: 'components/user-photos/user-photosTemplate.html',
                    controller: 'UserPhotosController'
                }
            }
            /*resolve: {
                photos: function($stateParams, UserPhotosService) {
                    return UserPhotosService.getPhotos($stateParams.userId);
                }
        })*/
        .state('photos', {
            parent: 'root',
            abstract: 'true',
            url: '/photos/:userId',
            params: {advancedFeatures: null},
            resolve: {
                userPhotosService: 'UserPhotosService',
                photoData: function(userPhotosService, $stateParams) {
                    return userPhotosService.getPhotos($stateParams.userId)
                        .then(function(result) {
                            var data = {
                                photos: [],
                                comments: [],
                                ids: [],
                                routes: []
                            }
                            angular.forEach(result, function(photo) {
                                data.photos.push(photo);
                                data.comments.push({comment: ''});
                                data.ids.push(photo._id);
                                data.routes.push('photos.displayOne({photoId:' + photo._id + '})');
                            });
                            return data;
                        });
                },
            },
            /*onEnter: function($timeout, $state, $stateParams, photoData) {
                // HACK: Allows onEnter function to terminate normally 
                $timeout(function() {
                    if ($stateParams.advancedFeatures === true && photoData.routes.length > 0) {
                        $state.go('photos.displayOne', {photoId: photoData.ids[0]});
                    } else {
                        $state.go('photos.displayAll');
                    }
                });
            },*/
            views: {
                'display@root': {
                    templateUrl: 'components/user-photos/user-photosTemplate.html',
                    controller: 'UserPhotosController'
                }
            }
        })
        .state('photos.display', {
            url: '',
            templateUrl: 'components/user-photos/user-photosAllTemplate.html',
            onEnter: function($timeout, $state, $stateParams, photoData) {
                // HACK: Allows onEnter function to terminate normally 
                $timeout(function() {
                    if ($stateParams.advancedFeatures === true && photoData.routes.length > 0) {
                        $state.go('photos.displayOne', {photoId: photoData.ids[0]});
                    }
                });
            }
        })
        .state('photos.displayOne', {
            url: '/:photoId',
            templateUrl: 'components/user-photos/user-photoDetailTemplate.html',
            controller: 'UserPhotoDetailController'
        })

    //$stateProviderRef = $stateProvider;
}]);

cs142App.controller('MainController', ['$rootScope', '$scope', '$location', '$http', 'Session',
    function ($rootScope, $scope, $location, $http, Session) {
        var selectedPhotoFile;
        
        $scope.inputFileNameChanged = function(element) {
            selectedPhotoFile = element.files[0];
        };

        $scope.inputFileNameSelected = function() {
            return !!selectedPhotoFile;
        };

        $scope.uploadPhoto = function() {
            if (!$scope.inputFileNameSelected()) {
                console.error('uploadPhoto called with no selected file');
                return;
            }
            console.log('fileSubmitted', selectedPhotoFile);
            
            var domForm = new FormData();
            domForm.append('uploadedphoto', selectedPhotoFile);
            $http.post('/photos/new', domForm, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function(newPhoto) {
                console.log(newPhoto);
                // The photo was successfully uploaded. XXX - Do something with photo
            }).error(function(err) {
                // Couldn't upload photo. XXX - Handle error
                console.error('ERROR uploading photo', err);
            });
        };

        $scope.main = {};
        $scope.main.title = 'Users';
        $scope.main.selectedUser = '';
        $scope.main.loggedIn = Session.isLoggedIn();
        $scope.main.loggedInId = Session.getUserFirstName();
        $scope.main.advancedFeatures = {};
        $scope.main.advancedFeatures.enabled = false;

        $scope.main.logout = Session.logout;
        
        $rootScope.$on('sessionChanged', function() {
            $scope.main.loggedInUser = Session.getUserFirstName();
            $scope.main.loggedIn = Session.isLoggedIn();
        });

        $rootScope.$on('$routeChangeStart', function(event, next, current) {
            if ($scope.main.loggedIn === false) {
                if (next.templateUrl !== 'components/login-register/login-registerTemplate.html') {
                    $location.path('/login-register');
                }
            }
        });

        $scope.$watch('main.selectedUser', function(newValue, oldValue) {
            if (newValue !== oldValue) $scope.main.selectedUser = newValue;
        });
    }
]);

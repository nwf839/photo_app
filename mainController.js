'use strict';

angular.module('cs142App.core', ['ngMaterial', 'ngResource', 'ngMessages']);
var cs142App = angular.module('cs142App', ['mentio', 'ui.router', 'cs142App.core', 'cs142App.services', 'cs142App.directives']);

cs142App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$mdIconProvider',
    function($stateProvider, $locationProvider, $urlRouterProvider, $mdIconProvider) {
    $urlRouterProvider.otherwise('/login-register/login');
    $stateProvider
       

        .state('root', {
            abstract: true,
            resolve: {
                userListService: 'UserListService',
                list: function(userListService) {
                    return userListService.getUserList();
                },
                updateList: function(userListService) {
                    return userListService.getUserList;
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
        })

        .state('profile', {
            parent: 'root',
            url: '/profile/:userId',
            resolve: {
                userDetailService: 'UserDetailService',
                userData: function($stateParams, userDetailService) {
                    return userDetailService.getUser($stateParams.userId)
                        .then(function(result) {
                            var data = {
                                user: result,
                                isDisabled: {}
                            };
                            angular.forEach(Object.keys(result), function(key) {
                                data.isDisabled[key] = true;
                            });
                            return data;
                        });
                },
                updateUser: function($stateParams, userDetailService) {
                        return userDetailService.updateUser.bind(null, $stateParams.userId);
                }
            },
            views: {
                'display@root': {
                    templateUrl: 'components/user-profile/user-profileTemplate.html',
                    controller: 'UserProfileController'
                }
            }
        })

        .state('login-register', {
            parent: 'root',
            abstract: 'true',
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
            templateUrl: 'components/login-register/loginTemplate.html'
        })
        .state('login-register.register', {
            url: '/register',
            templateUrl: 'components/login-register/registerTemplate.html'
        })


        .state('photos', {
            parent: 'root',
            abstract: 'true',
            url: '/photos',
            views: {
                'display@root': {
                    templateUrl: 'components/user-photos/user-photosTemplate.html',
                }
            }
        })
        .state('photos.display', {
            url: '/:userId',
            templateUrl: 'components/user-photos/user-photosDisplayTemplate.html',
            controller: 'UserPhotosController',
            resolve: {
                userPhotosService: 'UserPhotosService',
                photoData: function(userPhotosService, $stateParams) {
                    return userPhotosService.getPhotos($stateParams.userId)
                        .then(function(result) {
                            var data = {
                                photos: [],
                                comments: [],
                                ids: []
                            }
                            angular.forEach(result, function(photo) {
                                data.photos.push(photo);
                                data.comments.push({comment: ''});
                                data.ids.push(photo._id);
                            });
                            return data;
                        });
                },
            }
        })
        .state('photos.display.detail', {
            url: '/:photoId',
            resolve: {
                photoDetail: function($stateParams, photoData) {
                    var data = {};
                    data.photoIndex = photoData.ids.indexOf($stateParams.photoId);
                    data.photo = photoData.photos[data.photoIndex];
                    data.commentModel = {comment: ''};
                    data.ids = photoData.ids;
                    return data;
                }
            },
            views: {
                'display@root': {
                    templateUrl: 'components/photo-detail/photo-detailTemplate.html',
                    controller: 'PhotoDetailController'
                }
            }
        })


        .state('comments', {
            parent: 'root',
            url: '/comments/:userId',
            resolve: {
                userCommentsService: 'UserCommentsService',
                comments: function($stateParams, userCommentsService) {
                    return userCommentsService.getComments($stateParams.userId);
                }
            },
            views: {
                'display@root': {
                    templateUrl: 'components/user-comments/user-commentsTemplate.html',
                    controller: 'UserCommentsController'
                }
            }
        });
    $mdIconProvider
        .defaultFontSet('fa')
        .icon('dropdown', '/assets/images/icons/ic_arrow_drop_down_24px.svg');
}]);
cs142App.run(function(Session) {
    Session.getStatus();
});

cs142App.controller('MainController', ['$rootScope', '$scope', '$state', '$timeout', '$http', 'Session', 
    function ($rootScope, $scope, $state, $timeout, $http, Session) {
        var selectedPhotoFile;
        
        $scope.main = {};

        $scope.inputFileNameChanged = function(element) {
            selectedPhotoFile = element.files[0];
            $scope.$apply($scope.showUpload = $scope.inputFileNameSelected());
        };

        $scope.clearPhotoFile = function() {
            document.getElementById('file-input').value = "";
            $scope.showUpload = false;
        };
        
        $scope.inputFileNameSelected = function() {
            return !!selectedPhotoFile;
        };

        $scope.showUpload = $scope.inputFileNameSelected();
        
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

        $scope.openMenu = function($mdOpenMenu, ev) {
            origEv = ev;
            $mdOpenMenu(ev);
        };
        $scope.main.title = 'Users';
        $scope.main.selectedUser = '';
        $scope.main.loggedIn = Session.isLoggedIn();
        $scope.main.loggedInUser = Session.getUserFullName();
        $scope.main.loggedInId = Session.getUserId();
        $scope.main.loggedInUsername = Session.getUsername();
        $scope.main.curIndex = -1;

        $scope.main.logout = Session.logout;
        
        $rootScope.$on('sessionChanged', function() {
            $scope.main.loggedInUser = Session.getUserFullName();
            $scope.main.loggedInUsername = Session.getUsername();
            $scope.main.loggedIn = Session.isLoggedIn();
            $scope.main.loggedInId = Session.getUserId();
        });

        $rootScope.$on('$stateChangeStart', function(event, toState) {
            if (Session.isLoggedIn === false) {
                if (toState.name !== 'login-register.login' && toState.name !== 'login-register.register') {
                    $timeout(function() {
                        $state.go('login-register.login');
                    });
                }
            }
        });

        $scope.$watch('main.selectedUser', function(newValue, oldValue) {
            if (newValue !== oldValue) $scope.main.selectedUser = newValue;
        });
    }
]);

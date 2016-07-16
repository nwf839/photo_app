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

cs142App.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/users');

    $stateProvider
        
        
        .state('users', {
            url: '/users',
            templateUrl: 'components/user-list/user-listTemplate.html',
            controller: 'UserListController'
        })
            .state('users.detail', {
                url: '/users/:userId',
                templateUrl: 'components/user-detail/user-detailTemplate.html',
                controller: 'UserDetailController'
            })


        .state('login-register', {
            url: '/login-register',
            templateUrl: 'components/login-register/login-registerTemplate.html',
            controller: 'LoginRegisterController'
        })
            .state('login-register.login', {
                url: '/login',
                templateUrl: 'components/login-register/loginTemplate.html
            })
            .state('login-register.register', {
                url: '/register',
                templateUrl: 'components/login-register/registerTemplate.html
            })


        .state('photos', {
            url: '/photos/:userId',
            templateUrl: 'components/user-photos/user-photosTemplate.html',
            controller: 'UserPhotosController'
        })
            .state('photos.detail', {
                url: '/:photoId',
                templateUrl: 'components/user-photos/user-photosTemplate.html
            })
    /*$urlRouterProvider.deferIntercept();
    $urlRouterProvider.otherwise('/users');

    $locationProvider.html5Mode({enabled: false});
    $stateProviderRef = $stateProvider;*/
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
        $scope.main.advancedFeatures.enabled = true;

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

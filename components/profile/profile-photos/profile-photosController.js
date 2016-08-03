cs142App.controller('ProfilePhotosController', ['$scope', 'photoData',
    function($scope, photoData) {
        $scope.photoProfile = {};
        $scope.photoProfile.photos = photoData;
    }
]);

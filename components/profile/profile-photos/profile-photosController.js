cs142App.controller('ProfilePhotosController', ['$scope', '$mdDialog', 'photoData', 'deletePhoto',
    function($scope, $mdDialog, photoData, deletePhoto) {
        $scope.photoProfile = photoData;
        var deletePic = function(id, pIndex) {
            deletePhoto(id)
                .then(function() {
                    $scope.photoProfile.photos.splice(pIndex, 1);
                });
        };

        $scope.showHeader = function(id) {
            $scope.photoProfile.iconIsVisible[id] = true;
        };

        $scope.hideHeader = function(id) {
            $scope.photoProfile.iconIsVisible[id] = false;
        };

        $scope.showDialog = function(ev, id, pIndex) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this photo?')
                .textContent('Press "Delete" to confirm or "Cancel" to ignore')
                .targetEvent(ev)
                .cancel('Cancel')
                .ok('Delete')
            $mdDialog.show(confirm).then(function() {
                deletePic(id, pIndex);
            });
        };
    }
]);

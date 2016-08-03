cs142App.controller('ProfileUserController', ['$scope', 'userData', 'updateUser', function($scope, userData, updateUser) {
    $scope.userProfile = userData;
    $scope.backupState = '';
    $scope.updateUser = function(fieldNameStr) {
        updateUser($scope.userProfile.user);
        $scope.userProfile.isDisabled[fieldNameStr] = true;
        $scope.backupState = '';
    };
    $scope.toggleAccessibility = function(fieldNameStr) {
        $scope.backupState = $scope.userProfile.user[fieldNameStr];
        $scope.userProfile.isDisabled[fieldNameStr] = !$scope.userProfile.isDisabled[fieldNameStr];
    };
    $scope.undoChanges = function(fieldNameStr) {
        $scope.userProfile.user[fieldNameStr] = $scope.backupState;
        $scope.backupState = '';
        $scope.userProfile.isDisabled[fieldNameStr] = true;
    };
}]);

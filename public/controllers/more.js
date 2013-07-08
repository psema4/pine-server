var testApp = angular.module('testapp', []);

function moreController($scope, $location, gameinfo) {
    $scope.title = '';
    $scope.description = '';

    var id = /\/(\w+)$/.exec($location.$$path)[1];

    $scope.gameInfo = gameinfo.get(id, function(manifest) {
        $scope.title = manifest.title;
        $scope.description = manifest.description;
    });

    $scope.quit = function() {
        $location.path('/');
    }
}

testApp.controller('moreController', moreController);
moreController.$inject = ['$scope', '$location', 'GameInfo'];


var testApp = angular.module('testapp', ['testapp.services']);

function envController($scope, $location, News) {
    window.location = "http://pinegames.org:5000/#/Explore";
/*
    $scope.news = "2013-07-07: pinegames.org will be available soon";

    $scope.news = News.get(function(latest) {
        $scope.news = latest;
    });

    $scope.more = function(id) {
        $location.path('/game/'+id);
    }
*/
}

testApp.controller('envController', envController);
envController.$inject = ['$scope', '$location', 'News'];

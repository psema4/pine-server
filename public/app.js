var testApp = angular.module('testapp', ['testapp.services']);

testApp.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        controller: 'envController',
        templateUrl: 'views/environment.html'
    })
    .when('/game/:id', {
        controller: 'moreController',
        templateUrl: 'views/more.html'
    })
    .otherwise({redirectTo: '/'});

}).run(function($rootScope, $location, $templateCache, $window) {
    $rootScope.$on("$routeChangeStart", function(evt, next, current) {
        // try to remove as many dom-refs as possible - particularly the reference to canvas, stored within Game.ctx [created in gameController.$scope.setup()]
        for (var key in $window.Game) {
            delete $window.Game[key];
        };
        $window.Game = {};

        // try to clear ng's template cache
        //console.log('$templaceCach.info():', $templateCache.info());
        $templateCache.removeAll();

        // force garbage collection if available
        //
        //   note: chrome requires --js-flags=--expose-gc
        //         eg. bash$ /usr/bin/google-chrome --js-flags=--expose-gc
        //
        if ('gc' in $window && typeof $window.gc == 'function') {
            $window.gc();
        }
    });

    $rootScope.$on("$routeChangeSuccess", function(evt, current, previous) {
        if ((! '$$route' in current) || (current.$$route == undefined)) return;
    });
});


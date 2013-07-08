var services = angular.module('testapp.services', []);

services.factory('Empty', function() {
    return function() {
    }
});

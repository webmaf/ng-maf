(function () {
    'use strict';

    angular
        .module('app', [
            'steam',
            'ngRoute'
        ])
        .controller('routeController', routeController)
        .config(configureRoute);

    // ----------- if this missing than:
    angular
        .module('steam', []);
    // ----------- Error: [$injector:nomod] Module 'steam' is not available!

    // ----- functions
    // ====================================================================================

    function routeController($scope, $routeParams) {
        $scope.param = $routeParams.param;
    }

    function configureRoute($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'welcome.html'
            })
            .when('/steam', {
                templateUrl: 'steam.html'
            })
            .when('/steam/:achievements', {
                templateUrl: 'steam.html',
                controller: 'routeController'
            })
            .when('/one/:game/:test', {
                templateUrl: 'src/view/one.html',
                controller: 'oneCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    }
}());

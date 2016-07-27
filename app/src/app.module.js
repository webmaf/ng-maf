(function () {
    'use strict';

    angular
        //.module('steam', ['ngRoute']);
        .module('app', [
            'steam',
            'ngRoute'
        ])

        .config(configureRoute);

    // ----------- if this missing than:
    angular
        .module('steam', []);
    // ----------- Error: [$injector:nomod] Module 'steam' is not available!

    // ----- functions
    // ====================================================================================

    function configureRoute($routeProvider) {
        console.log('daaa');
        $routeProvider
            .when('/', {
                templateUrl: 'src/view/welcome.html'
            })
            .when('/steam', {
                templateUrl: 'src/view/steam.html'
            })
            .when('/one/:game/:test', {
                templateUrl: 'src/view/one.html',
                controller: 'oneCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }

    // TEST TEST TEST DELETE
    // ====================================================================================

    angular
        .module('one', [
            'one.two',
            'ngRoute'
        ]);

    angular
        .module('one.two', []);

    angular
        .module('one')
        .controller('oneCtrl', function ($scope, $routeParams) {
            console.log(1, 'oneCtrl');
            $scope.model = {
                train: $routeParams.game + '/' + $routeParams.test
            }
        })
        .config(configureRoute)
        .config(function () {
            console.log(1, 'oneConfig');
        });

    angular
        .module('one.two')
        .controller('twoCtrl', function () {
            console.log(2, 'twoCtrl');
        })
        .config(function () {
            console.log(2, 'twoConfig');
        });

    // ====================================================================================
}());

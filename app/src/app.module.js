(function () {
    'use strict';

    angular
        //.module('steam', ['ngRoute']);
        .module('app', [
            //'app.steam',
            'ngRoute'
        ])

        .config(configureRoute);

    // ----- functions
    // ====================================================================================

    function configureRoute($routeProvider) {
        console.log('daaa');
        $routeProvider
            .when('/steam', {
                templateUrl: 'src/view/steam.html'
            })
            .when('/:train', {
                templateUrl: 'index.html',
                controller: 'appCtrl'
            })
            .otherwise({
                template: '<h1>Rappel Zappel im Karton</h1>'
            });
    }
}());

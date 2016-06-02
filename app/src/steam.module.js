(function () {
    'use strict';

    angular
        .module('steam', []);


    angular
        .module('steam')
        .controller('steamCtrl', function () {
            console.log(3, 'steamCtrl');
        })
        .config(function () {
            console.log(3, 'steamConfig');
        });
}());

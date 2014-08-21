var app = angular.module('mafApp', [
    'ngRoute',
    'xml'
]);

app.config(function config($httpProvider) {
    $httpProvider.interceptors.push('xmlHttpInterceptor');
});

app.run(function run() {

});

app.controller('AppCtrl', function AppCtrl($scope) {

});


var app = angular.module('mafApp', [
    'ngRoute',
    'xml'
]);

app.config(function config($httpProvider) {
    $httpProvider.interceptors.push('xmlHttpInterceptor');

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    console.log($httpProvider.defaults.headers);
});

app.run(function run() {

});

app.controller('AppCtrl', function AppCtrl($scope) {

});


(function () {
    'use strict';

    angular
        .module('steam')
        .factory('HttpConfigInterceptor', HttpConfigInterceptor)
        .factory('steamService', steamService)
        .config(configureModule);

    function steamService($http) {
        var service = {
            getInfo: getInfo,
            getSteamXML: getSteamXML,
        };

        return service;

        // ----- functions
        // ====================================================================================

        function getSteamXML(profile, game) {
            var url = 'http://steamcommunity.com/id/webmaf/stats/377160/?tab=achievements&xml=1';

            //http://steamcommunity.com/profiles/76561197971413380/stats/377160/?tab=achievements&xml=1

            return $http({
                method: 'POST',
                url: url,
                data: flightData.data
            });
        }

        function getInfo() {
            console.log(123);
        }
    }

    function HttpConfigInterceptor($q) {
        var interceptor = {};

        interceptor.requestError = function (rejection) {
            return $q.reject(rejection);
        };

        interceptor.responseError = function (rejection) {
            return $q.reject(rejection);
        };

        return interceptor;
    }

    function configureModule($httpProvider) {
        $httpProvider.interceptors.push('HttpConfigInterceptor');
    }
}());

(function () {
    'use strict';

    angular
        .module('steam')
        .factory('HttpConfigInterceptor', HttpConfigInterceptor)
        .factory('steamService', steamService)
        .config(configureModule);

    function steamService($http) {
        var service = {
            getSteamXML: getSteamXML,
            getSteamGames: getSteamGames
        };

        return service;

        // ----- functions
        // ====================================================================================

        function getSteamXML(player, game) {
            var gID = game || '377160',
                names = player.names || ['maf'],
                profiles = player.profiles || ['id/webmaf'];



            return $http({
                url: 'php/steam.php',
                method: 'POST',
                data: {
                    game: gID,
                    names: names,
                    profiles: profiles
                }
            });
        }

        function getSteamGames(profile) {
            var url,
                pID = profile || 'id/webmaf';

            url = 'http://steamcommunity.com/' + pID + '/games?tab=all&xml=1';

            return $http({
                url: 'php/steamGames.php',
                method: 'POST',
                data: {
                    url: url
                }
            });
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

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
            getSteamGames: getSteamGames,
            localTime: localtime,
            testAnything: testAnything
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

            console.log(url);

            return $http({
                url: 'php/steamGames.php',
                method: 'POST',
                data: {
                    url: url
                }
            });
        }

        function localtime() {
            var now = new Date(),
                month = now.getMonth() + 1, // return 0-11
                date = [now.getDate(), (month < 10) ? '0' + month.toString() : month, now.getFullYear()],
                time = [now.getHours(), now.getMinutes()];

            return date.join('.') + ' ' + time.join(':');
        }

        function testAnything() {
            var url = 'http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=292030&key=6EE54A74BC03B9E91F9E67F903DAF983&steamid=76561197995754090&l=german';

            return $http({
                url: url,
                method: 'POST'
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

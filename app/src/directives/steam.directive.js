(function () {
    'use strict';

    angular
        .module('steam')
        .directive('steam', steamDirective);

    function steamDirective(steamService) {
        return {
            restrict: 'A',
            templateUrl: 'app/src/view/steam.tpl.html',
            controller: steamController
        };

        function steamController($scope, $filter) {
            /* jshint validthis: true */
            var vm = this,
                orderBy = $filter('orderBy');

            vm.passengers = [];

            $scope.steamCompareStatus = 'untouched';
            $scope.steamOrder = steamOrder;
            $scope.togglePlayer = togglePlayer;
            $scope.getGamesFromGamer = getGamesFromGamer;
            $scope.compareGame = compareGame;
            $scope.achievements = [];
            $scope.tableHeader = [];

            $scope.playerMax = 4;
            $scope.playerCnt = 0;

            activate();

            // ----- functions
            // ====================================================================================

            /**
             * start the application
             */
            function activate() {
                $scope.gamer = [
                    {name: 'asmo', profile: 'profiles/76561197987497201', active: false},
                    {name: 'janleon', profile: 'profiles/76561197995374327', active: false},
                    {name: 'jessi', profile: 'profiles/76561197960362967', active: false},
                    {name: 'maf', profile: 'profiles/76561197995754090', active: false},
                    {name: 'melth', profile: 'profiles/76561198005875496', active: false},
                    {name: 'sarx', profile: 'profiles/76561197971413380', active: false}
                ];
                $scope.games = (localStorage.webmafGames && localStorage.webmafGames.length > 0) ? JSON.parse(localStorage.webmafGames) : [];
                $scope.times = (localStorage.webmafTimes && localStorage.webmafTimes.length > 0) ? JSON.parse(localStorage.webmafTimes) : 'asa';
                $scope.gamelist = $scope.games[0];

                // select-picker initializing
                angular.element(document).ready(function () {
                    $('.selectpicker').selectpicker('refresh');
                });
            }

            function compareGame() {
                var player = {
                    profiles: [],
                    names: []
                };

                if (!$scope.playerCnt || $scope.steamCompareStatus == 'pending') {
                    return;
                }

                $scope.steamCompareStatus = 'pending';
                $scope.tableHeader = [];
                $scope.achievements = [];

                for (var index in $scope.gamer) {
                    if ($scope.gamer[index].active) {
                        player.names.push($scope.gamer[index].name);
                        player.profiles.push($scope.gamer[index].profile);
                    }
                }

                if (player.names.length && $scope.gamelist.achievement && $scope.gamelist.globalStatsLink) {
                    steamService.getSteamXML(player, $scope.gamelist.achievement)
                        .then(function (response) {
                            var saveOnceAchievements = 0;

                            if (response.data && response.data !== '') {

                                for (var i = 0, l = response.data.length; i < l; i++) { // i = count of gamer
                                    $scope.tableHeader[i] = {
                                        player: response.data[i][0].player,
                                        count: response.data[i][0].count
                                    };

                                    for (var j = 0, k = response.data[i].length; j < k; j++) { // j = count of achievements
                                        if (response.data[i][0].hasOwnProperty('error')) {
                                            saveOnceAchievements++;
                                            break;
                                        } else {
                                            if (i == saveOnceAchievements) { // only once
                                                if (response.data[i][j].api != 'countOfUnlock') {
                                                    $scope.achievements[j] = {
                                                        api: response.data[i][j].api,
                                                        description: response.data[i][j].description,
                                                        imageClosed: response.data[i][j].imageClosed,
                                                        imageOpen: response.data[i][j].imageOpen,
                                                        name: response.data[i][j].name,
                                                        gamer: []
                                                    };
                                                    $scope.achievements[j]['player' + i] = response.data[i][j].player;
                                                }
                                            }

                                            if (response.data[i][j].api != 'countOfUnlock') {
                                                $scope.achievements[j].gamer[i] = {
                                                    stamp: response.data[i][j].stamp,
                                                    time: response.data[i][j].time,
                                                    unlock: response.data[i][j].unlock
                                                };
                                                $scope.achievements[j]['player' + i] = response.data[i][j].unlock;
                                            } else {
                                                $scope.achievements[j] = null;
                                            }
                                        }
                                    }
                                }
                                $scope.achievements = $scope.achievements.slice(1, $scope.achievements.length);
                                steamOrder('name');
                            }
                            $scope.loadedAchievement = ($scope.achievements.length);

                            $scope.steamCompareStatus = 'response';
                        });
                }
            }

            function getGamesFromGamer() {
                if (!localStorage.webmafGames || localStorage.webmafGames && localStorage.webmafGames.length !== 0) {
                    steamService.getSteamGames($scope.gamer[3].profile)
                        .then(function (response) {
                            var storage = {};

                            if (response.data && response.data !== '') {
                                $scope.games = storage.games = response.data;
                                $scope.times = storage.times = steamService.localTime();
                                $scope.gamelist = $scope.games[0];

                                localStorage.setItem('webmafGames', JSON.stringify(storage.games));
                                localStorage.setItem('webmafTimes', JSON.stringify(storage.times));
                            }
                        });
                }
            }

            function steamOrder(predicate) {
                $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                $scope.predicate = predicate;
                $scope.achievements = orderBy($scope.achievements, predicate, $scope.reverse);
            }

            function togglePlayer(typ) {
                if (typ.active || $scope.playerCnt < $scope.playerMax) {
                    typ.active = !typ.active;

                    if (typ.active) {
                        $scope.playerCnt++;
                    } else {
                        $scope.playerCnt--;
                    }
                }
            }
        }
    }
}());

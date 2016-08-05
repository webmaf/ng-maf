(function () {
    'use strict';

    angular
        .module('steam')
        .directive('steam', steamDirective);

    function steamDirective(steamService) {
        return {
            restrict: 'A',
            templateUrl: '/view/steam.tpl.html',
            controller: steamController
        };

        function steamController($scope, $filter, $timeout) {
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
            $scope.loading = {};

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
                $scope.gamesLength = Object.keys($scope.games).length;
                $scope.times = (localStorage.webmafTimes && localStorage.webmafTimes.length > 0) ? JSON.parse(localStorage.webmafTimes) : '';
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
                                                $scope.achievements[j]['player' + i] = response.data[i][j].stamp;
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
                    var start = new Date().getTime(),
                        end = 0;

                    $scope.loading.gamelist = true;

                    steamService.getSteamGames($scope.gamer)
                        .then(function (response) {
                            $scope.loading.gamelist = false;
                            end = new Date().getTime();

                            if (response.data && response.data !== '') {
                                $scope.games = response.data;
                                $scope.gamesLength = Object.keys($scope.games).length;
                                $scope.times = {
                                    times: steamService.localTime(),
                                    delay: end - start
                                };
                                $scope.gamelist = $scope.games[0];

                                localStorage.setItem('webmafGames', JSON.stringify($scope.games));
                                localStorage.setItem('webmafTimes', JSON.stringify($scope.times));

                                $timeout(function() {
                                    $('.selectpicker').selectpicker('refresh');
                                }, 100);
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

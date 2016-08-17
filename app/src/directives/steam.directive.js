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

        function steamController($scope, $filter, $timeout, $location) {
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

            $scope.$watch('gamelist', function () {
                $location.search('game', $scope.gamelist.achievement);
            });

            activate();

            // ----- functions
            // ====================================================================================

            /**
             * start the application
             */
            function activate() {
                $scope.gamer = [
                    {id: 0, name: 'asmo', profile: 'profiles/76561197987497201', active: false},
                    {id: 1, name: 'janleon', profile: 'profiles/76561197995374327', active: false},
                    {id: 2, name: 'jessi', profile: 'profiles/76561197960362967', active: false},
                    {id: 3, name: 'maf', profile: 'profiles/76561197995754090', active: false},
                    {id: 4, name: 'melth', profile: 'profiles/76561198005875496', active: false},
                    {id: 5, name: 'sarx', profile: 'profiles/76561197971413380', active: false}
                ];

                if (localStorage.webmafGames && localStorage.webmafGames.length > 0) {
                    $scope.games = JSON.parse(localStorage.webmafGames);
                    $scope.times = JSON.parse(localStorage.webmafTimes);
                    $scope.gamesLength = Object.keys($scope.games).length;
                    $scope.gamelist = $scope.games[0];

                    angular.element(document).ready(function () {
                        $('.selectpicker').selectpicker('refresh');
                    });

                    setLocationParameters();
                } else {
                    steamService.loadGames()
                        .then(function (response) {
                            $scope.games = response.data[0] || [];
                            $scope.times = {
                                times: response.data[1] || '',
                                delay: 0
                            };
                            $scope.gamesLength = Object.keys($scope.games).length;
                            $scope.gamelist = $scope.games[0];

                            angular.element(document).ready(function () {
                                $('.selectpicker').selectpicker('refresh');
                            });

                            setLocationParameters();
                        });
                }
            }

            function setLocationParameters() {
                var location = $location.search();

                if (location.player) {
                    for (var i = 0; i < location.player.length; i++) {
                        $scope.gamer[location.player.charAt(i)].active = true;
                        $scope.playerCnt++;
                    }
                }

                if (location.game) {
                    for (var needle in $scope.games) {
                        if ($scope.games[needle].achievement == location.game) {
                            $scope.gamelist = $scope.games[needle];
                            break;
                        }
                    }
                } else {
                    $location.search('game', $scope.gamelist.achievement);
                }
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
                                $scope.games = response.data[0];
                                $scope.gamesLength = Object.keys($scope.games).length;
                                $scope.times = {
                                    times: response.data[1],
                                    delay: end - start
                                };
                                $scope.gamelist = $scope.games[0];

                                localStorage.setItem('webmafGames', JSON.stringify($scope.games));
                                localStorage.setItem('webmafTimes', JSON.stringify($scope.times));

                                $timeout(function () {
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
                var location = $location.search();

                if (typ.active || $scope.playerCnt < $scope.playerMax) {
                    typ.active = !typ.active;

                    location.player = location.player || '';

                    if (typ.active) {
                        $scope.playerCnt++;

                        $location.search('player', location.player + typ.id);
                    } else {
                        $scope.playerCnt--;

                        $location.search('player', location.player.replace(typ.id, ''));
                        if (location.player.length == 0) {
                            $location.search('player', null);
                        }
                    }
                }
            }
        }
    }
}());

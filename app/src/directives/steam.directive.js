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
            var vm = this;
            var orderBy = $filter('orderBy');

            vm.passengers = [];

            $scope.steamOrder = steamOrder;
            $scope.toggleGamer = toggleGamer;
            $scope.toggleFilter = toggleFilter;
            $scope.getGamesFromGamer = getGamesFromGamer;
            $scope.compareGame = compareGame;

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
                    {name: 'maf', profile: 'profiles/76561197995754090', active: true},
                    {name: 'melth', profile: 'profiles/76561198005875496', active: false},
                    {name: 'sarx', profile: 'profiles/76561197971413380', active: false}
                ];
                $scope.filterSet = [
                    {name: 'default', order: 'api', modus: 0},
                    {name: 'name', order: 'name', modus: 0},
                    {name: 'description', order: 'description', modus: 0},
                    {name: 'unlock', order: 'unlock', modus: 0},
                    {name: 'timestamp', order: 'stamp', modus: 1}
                ];
                $scope.games = (localStorage.webmafGames && localStorage.webmafGames.length > 0) ? JSON.parse(localStorage.webmafGames) : [];
                $scope.gamelist = $scope.games[0];
            }

            function compareGame() {
                var player = {
                    profiles: [],
                    names: []
                };

                for (var index in $scope.gamer) {
                    if ($scope.gamer[index].active) {
                        player.names.push($scope.gamer[index].name);
                        player.profiles.push($scope.gamer[index].profile);
                    }
                }

                if (player.names.length && $scope.gamelist.achievement && $scope.gamelist.globalStatsLink) {
                    steamService.getSteamXML(player, $scope.gamelist.achievement)
                        .then(function (response) {
                            var savingAchievement = 0;

                            if (response.data && response.data != '') {
                                $scope.achievements = [];
                                $scope.tableHeader = [];
                                console.log(response.data);

                                for (var i = 0, l = response.data.length; i < l; i++) { // i = count of gamer
                                    for (var j = 0, k = response.data[i].length; j < k; j++) { // j = count of achievements
                                        if (response.data[i][0] == null) {
                                            savingAchievement++;
                                            break;
                                        } else {
                                            if (i == savingAchievement) {
                                                if (response.data[i][j].api == 'countOfUnlock') {
                                                    $scope.tableHeader[j] = {
                                                        api: response.data[i][j].api,
                                                        gamer: []
                                                    };
                                                } else {
                                                    $scope.achievements[j] = {
                                                        api: response.data[i][j].api,
                                                        description: response.data[i][j].description,
                                                        imageClosed: response.data[i][j].imageClosed,
                                                        imageOpen: response.data[i][j].imageOpen,
                                                        name: response.data[i][j].name,
                                                        gamer: []
                                                    };
                                                }
                                            }

                                            if (response.data[i][j].api == 'countOfUnlock') {
                                                $scope.tableHeader[j].gamer[i] = {
                                                    player: response.data[i][j].player,
                                                    count: response.data[i][j].count
                                                };
                                            } else {
                                                $scope.achievements[j].gamer[i] = {
                                                    stamp: response.data[i][j].stamp,
                                                    time: response.data[i][j].time,
                                                    unlock: response.data[i][j].unlock
                                                };
                                            }
                                        }
                                    }
                                }
                                console.log($scope.achievements);
                                toggleFilter('default');
                            }
                        });

                }
            }

            function getGamesFromGamer() {
                if (!localStorage.webmafGames || localStorage.webmafGames && localStorage.webmafGames.length == 0) {
                    steamService.getSteamGames($scope.gamer[3].profile)
                        .then(function (response) {
                            console.log(response);
                            if (response.data && response.data != '') {
                                $scope.games = response.data;
                                localStorage.setItem('webmafGames', JSON.stringify($scope.games));
                                $scope.gamelist = $scope.games[0];
                            }
                        });
                }
            }

            function steamOrder(predicate) {
                $scope.predicate = predicate;
                $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                $scope.achievements = orderBy($scope.achievements, predicate, $scope.reverse);
            }

            function toggleGamer(typ) {
                typ.active = !typ.active;
                console.log(typ);
            }

            function toggleFilter(filter) {
                steamOrder(filter);
                $scope.filterActive = filter;
            }
        }
    }
}());

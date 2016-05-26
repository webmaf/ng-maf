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
                    {name: 'asmo', profile: '/profiles/76561197987497201', active: false},
                    {name: 'janleon', profile: 'profiles/76561197995374327', active: false},
                    {name: 'jessi', profile: 'profiles/76561197960362967', active: false},
                    {name: 'maf', profile: 'profiles/76561197995754090', active: true},
                    {name: 'melth', profile: '/profiles/76561198005875496', active: false},
                    {name: 'sarx', profile: '/profiles/76561197971413380', active: false}
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
                if ($scope.gamelist.achievement && $scope.gamelist.globalStatsLink) {
                    steamService.getSteamXML($scope.gamer[3].profile, $scope.gamelist.achievement)
                        .then(function (response) {
                            console.log(response);
                            if (response.data && response.data != '') {
                                $scope.achievements = response.data;
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

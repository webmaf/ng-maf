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
                    {name: 'unlock', order: 'unlock', modus: 1},
                    {name: 'timestamp', order: 'stamp', modus: 1}
                ];
                $scope.game = {
                    //id: 377160, //fallout
                    id: 292030, //witcher3
                    name: 'toll'
                };
            }

            function compareGame() {
                steamService.getSteamXML($scope.gamer[3].profile, $scope.game.id)
                    .then(function (response) {
                        console.log(response);
                        if (response.data && response.data != '') {
                            $scope.achievements = response.data;
                            toggleFilter('default');
                        }
                    });
            }

            function getGamesFromGamer() {
                if (!localStorage.webmafGames || localStorage.webmafGames && localStorage.webmafGames.length == 0) {
                    steamService.getSteamGames($scope.gamer[3].profile)
                        .then(function (response) {
                            console.log(response);
                            if (response.data && response.data != '') {
                                $scope.games = response.data;
                                console.log(12);
                                localStorage.setItem('webmafGames', JSON.stringify($scope.games));
                            }
                        });
                } else {
                    $scope.games = JSON.parse(localStorage.webmafGames);
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

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

        function steamController($scope) {
            /* jshint validthis: true */
            var vm = this;

            vm.passengers = [];

            activate();

            // ----- functions
            // ====================================================================================

            /**
             * start the application
             */
            function activate() {
                //steamService.getInfo()
                //    .then(function (response) {
                //        if (response.status == 200 && response.data && angular.isObject(response.data)) {
                //            console.log('gooo');
                //        }
                //        else {
                //            $scope.widgetEnable = false;
                //        }
                //        $scope.loaded = true;
                //    });
                console.log(456);
            }
        }
    }
}());

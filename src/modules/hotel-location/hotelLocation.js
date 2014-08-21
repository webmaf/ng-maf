app.directive('hotelLocation', function () {
    'use strict';

    console.log('hotelLocation');

    return {
        restrict: 'A',
        $scope: {
            selected: 0
        },
        controller: function ($scope) {

            $scope.setActive = function (section) {
                if (section !== $scope.selected) {
                    $scope.selected = section;
                } else {
                    $scope.selected = null;
                }
            };

            $scope.isSelected = function (section) {
                return $scope.selected === section;
            };

            $scope.setActive(0);
        }
    };
});
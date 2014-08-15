angular.module('bookButton', [
    'restService'
])
    .directive('bookingButton', function (restService, $timeout) {
        'use strict';

        return {
            restrict: 'A',

            link: function ($scope, element, attr) {
                var checkValidation = function () {
                        $scope.isValid = false;

                        restService.executeRest('/book/vacancy')
                            .success(function (data) {
                                $timeout(function () {
                                    $scope.isDisabled = false;
                                    $scope.buttonName = "Buchen";
                                    $scope.restResponse = data;
                                    $scope.isValid = true;
                                }, 2000);
                            })
                            .error(function (data) {
                                $timeout(function () {
                                    $scope.isDisabled = false;
                                }, 2000);
                            });
                    },
                    goToBookingPage = function () {
                        window.location.href = $scope.restResponse.location;
                    };

                $scope.buttonName = "Check";
                $scope.isValid = false;
                $scope.restResponse = {};
                $scope.handleLink = function () {
                    if ($scope.isValid) {
                        goToBookingPage();
                    } else {
                        checkValidation();
                    }

                    $scope.isDisabled = true;
                };
            }
        };
    });
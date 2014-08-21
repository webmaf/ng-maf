angular.module('restService', [])

    .factory('restService', function RestService($http) {
        'use strict';

        /**
         *
         * @param urlKey = string; mandatory parameter
         * @param parameters = string; mandatory to complete the URL; Won't work correct without
         * @param method = string; optional; expected values are GET and POST; default method is GET;
         * @returns a list of available methods
         */
        function executeRest(urlKey, parameters, method) {
            return $http({
                method: method || 'GET',
                url: urlKey,
                params: parameters || '',
                timeout: 10000
            });
        }

        /* public api */
        return {
            executeRest: executeRest
        };
    });


angular.module('blogs', ['xml'])

//    .config(function ($httpProvider) {
//        $httpProvider.interceptors.push('xmlHttpInterceptor');
//    })

    .controller('blubb', function ($scope, $http) {
        $http.get('xmlSpec.xml').then(function (response) {
            var blogs = [],
                els = response.xml.find('blog'),
                blog, i;

            for (i = 0; i < els.length; i += 1) {
                blog = angular.element(els[i]);
                blogs.push({
                    name: blog.attr('name'),
                    id: blog.attr('id')
                });
            }

            $scope.blogs = blogs;
        });
    });
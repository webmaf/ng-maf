app.controller('blubb', function ($scope, $http) {
//        $http.get('mock/xmlSpec.xml').then(function (response) {
        $http.get('http://steamcommunity.com/id/webmaf/stats/BioShockInfinite?tab=achievements&xml=1&l=german').then(function (response) {
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
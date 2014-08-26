app.controller('blubb', function ($scope, $http) {
    var file = [
            '/mock/BioShockInfinite.xml',
            'http://steamcommunity.com/id/webmaf/stats/BioShockInfinite?tab=achievements&xml=1&l=german'
        ],
        type = 0;

    $http.get(file[type]).then(function (response) {

        var blogs = [],
            els = response.xml.find('playerstats').find('achievements').find('achievement'),
            blog, i;

        for (i = 0; i < els.length; i += 1) {
            blog = angular.element(els[i]);
            blogs.push({
                name: blog.find('name').text()
            });
        }

        console.log(els);

        $scope.blogs = blogs;
    });
});
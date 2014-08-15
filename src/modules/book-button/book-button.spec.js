describe('bookButton Controller', function () {
    var ctrl, scope, httpMock;

    beforeEach(module('bookButton'));

    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
        httpMock = $httpBackend;

        scope = $rootScope.$new();
        httpMock
            .when('Get', '/detail')
            .respond(true);

        ctrl = $controller;
        scope.isValid = false;
    }));

    it("one", function () {
        httpMock.expectGET('/detail');
//        httpMock.flush();
//        expect(scope.isValid).toBe(true);
    });
});
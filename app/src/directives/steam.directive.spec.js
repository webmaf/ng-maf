describe("- steam", function () {
    var httpBackend;


    window.tuiWidgetLoader = {
        log: function (a, b, c) {
            console[(b === 'debug') ? 'log' : b](a, c);
        }
    };

    beforeEach(function () {
        module('specTemplates');

        inject(function (_$httpBackend_) {
            httpBackend = _$httpBackend_;
        });
    });

    it("loading any json file and compare ", function () {
        //var data = fixture.load('response-more-aisle.mock.json');

        expect(1).toBe(1);
    });
});

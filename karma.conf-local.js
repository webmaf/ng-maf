'use strict';

module.exports = function (config) {
    config.set({

        basePath: '',

        autoWatch: false,

        frameworks: ['jasmine', 'fixture'],

        files: [
            './vendor/angular/angular.js',
            './vendor/angular-route/angular-route.js',
            './vendor/angular-mocks/angular-mocks.js',

            'app/src/**/*.js',
            'app/src/**/*.tpl.html',
            'app/mocks/*.json'
        ],

        plugins: [
            'karma-coverage',
            'karma-phantomjs-launcher',
            'karma-nyan-reporter',
            'karma-jasmine',
            'karma-fixture',
            'karma-json-fixtures-preprocessor',
            'karma-ng-html2js-preprocessor'
        ],

        preprocessors: {
            'app/src/js/*.js': ['coverage'],
            'app/src/**/*.tpl.html': ['ng-html2js'],
            'app/mocks/**/*.json': ['json_fixtures']
        },

        ngHtml2JsPreprocessor: {
            stripPrefix: './',
            moduleName: 'specTemplates'
        },

        jsonFixturesPreprocessor: {
            variableName: '__json__',
            stripPrefix: 'app/mocks',
            prependPrefix: 'spec/fixtures'
        },

        browsers: ['PhantomJS'],

        reporters: ['nyan', 'coverage'],

        nyanReporter: {
            suppressErrorReport: false,
            suppressErrorHighlighting: false,
            numberOfRainbowLines: 4
        },

        colors: true,
        singleRun: true
    })
};

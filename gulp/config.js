'use strict';

module.exports = {
    appName: 'ng-maf',

    indexHtml: 'index.html',

    dir: {
        src: 'app/src/',
        dist: 'app/dist/',
        app: 'app/',
        deploy: 'app/deploy/'
    },

    files: {
        js: [
            'app/src/**/*.js',
            'app/scripts/**/*.js',
            '!app/src/**/*.spec.js'
        ],
        jsLint: [
            'app/src/**/*.js',
            'app/scripts/**/*.js',
            '!app/src/**/*.spec.js',
            '!app/src/**/templates.js'
        ],
        scss: 'app/src/**/*.scss',
        htmlFiles: 'app/*.html',
        htmlTemplates: '**/*.tpl.html',
        mockAllFiles: '**/*.mock.json',
        vendorJS: [
            'vendor/angular/angular.min.js'
        ],
        renderJS: 'app/src/**/*.js',
        specs: 'app/src/**/*.spec.js',
        assets: [
            'app/assets/**/*.*'
        ],
        backstop: '../backstop/**/*.*',
        cucumber: '../cucumber/**/*.*'
    },

    karmaConfigLocal: '/../../karma.conf-local.js',
    karmaConfigProd: '/../../karma.conf-prod.js'
};
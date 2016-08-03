'use strict';

module.exports = {
    appName: 'ng-maf',
    moduleName: 'app',

    indexHtml: 'index.html',

    dir: {
        src: 'app/src/',
        dist: 'app/dist/',
        app: 'app/',
        deploy: 'app/deploy/'
    },

    files: {
        system: [
            'app/.htaccess'
        ],
        php: [
            'app/php/**/*.php',
            '!app/php/old/**/*.php'
        ],
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
        htmlTemplates: 'app/src/view/*.tpl.html',
        mockAllFiles: '**/*.mock.json',
        vendorJS: [
            'vendor/angular/angular.min.js',
            'vendor/angular-route/angular-route.min.js',
            'vendor/jquery/dist/jquery.min.js',
            'vendor/bootstrap-sass/assets/javascripts/bootstrap.min.js',
            'vendor/bootstrap-select/dist/js/bootstrap-select.min.js'
        ],
        renderJS: 'app/src/**/*.js',
        renderTemplates: '**/*.tpl.html',
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
'use strict';

var gulp = require('gulp'),
    browserSync = require('browser-sync');

module.exports = function (config) {
    gulp.task('browserSyncLocal', function () {
        var files = [
            'app/src/*.js',
            '!app/*.spec.js',
            '!app/*.mock.json',
            config.dir.dist + '*.css'
        ];

        browserSync({
            files: files,
            server: {
                baseDir: './app/'
            },
            port: 4000,
            ui: {
                port: 4001
            },
            startPath: '',
            plugins: ['bs-rewrite-rules'],
            rewriteRules: [
                {
                    match: /\/ms\/fe\/widgetloader\/global-widget.css/gi,
                    replace: 'http://ms-dev-testnode01.tui-interactive.com\/ms\/fe\/widgetloader\/global-widget.css'
                },
                {
                    match: /indexDevConfig/gi,
                    replace: 'indexLocalConfig'
                }
            ]
        });
    });
};

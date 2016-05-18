'use strict';

var gulp = require('gulp');

module.exports = function (config) {
    gulp.task('copyConfigJS', function () {
        return gulp.src([
            'app/scripts/indexLocalConfig.js',
            'app/scripts/indexDevConfig.js'
        ])
            .pipe(gulp.dest(config.dir.dist));
    });

    gulp.task('copyAllHTML', function () {
        return gulp.src(config.files.htmlFiles)
            .pipe(gulp.dest(config.dir.dist));
    });

    gulp.task('copyMockFiles', function () {
        return gulp.src(config.files.mockScenarios)
            .pipe(gulp.dest(config.dir.dist + '/mocks/'));
    });

    gulp.task('copyVendorJS', function () {
        return gulp.src(config.files.vendorJS)
            .pipe(gulp.dest(config.dir.dist));
    });

    gulp.task('copyAssets', function () {
        return gulp.src(config.files.assets)
            .pipe(gulp.dest(config.dir.dist + '/assets/'));
    });

    gulp.task('copyBackstop', function () {
        return gulp.src(config.files.backstop)
            .pipe(gulp.dest(config.dir.dist + '/backstop/'));
    });

    gulp.task('copyCucumber', function () {
        return gulp.src(config.files.cucumber)
            .pipe(gulp.dest(config.dir.dist + '/cucumber/'));
    });
};

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

    gulp.task('copySystem', function () {
        return gulp.src(config.files.system)
            .pipe(gulp.dest(config.dir.dist));
    });

    gulp.task('copyHTML', function () {
        return gulp.src(config.files.htmlFiles)
            .pipe(gulp.dest(config.dir.dist));
    });

    gulp.task('copyTemplates', function () {
        return gulp.src(config.files.htmlTemplates)
            .pipe(gulp.dest(config.dir.dist + '/view/'));
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

    gulp.task('copyPHP', function () {
        return gulp.src(config.files.php)
            .pipe(gulp.dest(config.dir.dist + '/php/'));
    });

    gulp.task('copyDistDeploy', function () {
        return gulp.src(config.dir.dist)
            .pipe(gulp.dest(config.dir.deploy));
    });
};

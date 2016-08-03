'use strict';

var gulp = require('gulp'),
    browserSync = require('browser-sync');

module.exports = function (config) {
    gulp.task('watchStyles', ['sass'], function () {
        return gulp.watch([config.files.scss], ['lintStylesDev', 'sass']);
    });

    gulp.task('watchJs', function () {
        return gulp.watch([config.files.js, config.files.specs], ['lintScripts', 'karmaDev', 'scripts']);
    });

    gulp.task('watchHTML', function () {
        return gulp.watch([config.files.htmlFiles, config.files.htmlTemplates], ['scripts', 'copyAllHTML']);
    });

    gulp.task('watchPHP', function () {
        return gulp.watch([config.files.php], ['copyPHP']);
    });

    gulp.task('watch', ['watchStyles', 'watchJs', 'watchHTML', 'watchPHP']);
};

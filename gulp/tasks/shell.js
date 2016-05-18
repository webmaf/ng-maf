'use strict';

var gulp = require('gulp'),
    shell = require('gulp-shell');

module.exports = function () {
    gulp.task('startBackend', function () {
        return gulp.src('app', {read: false})
            .pipe(shell([
                'cd ../backend/; gradle bootRun -Dspring.profiles.active=mock'
            ]));
    });
};

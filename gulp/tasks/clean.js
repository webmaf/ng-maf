'use strict';

var gulp = require('gulp'),
    rimraf = require('rimraf');

module.exports = function (config) {
    gulp.task('clean', function (cb) {
        return rimraf(config.dir.dist, cb);
    });
};

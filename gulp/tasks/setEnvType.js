'use strict';
var gulp = require('gulp'),
    util = require('gulp-util');

module.exports = function (config) {
    gulp.task('setEnvType', function () {
        return util.env.type = 'prod';
    });
};

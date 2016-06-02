'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    filter = require('gulp-filter'),
    ngHtml2js = require('gulp-ng-html2js'),
    wrap = require('gulp-wrap');

module.exports = function (config) {
    //this will fail the build if there is an error
    gulp.task('lintScriptsProd', function () {
        return gulp.src(config.files.jsLint)
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(jshint.reporter('fail'));
    });

    //this will *NOT* fail the build if there is an error
    gulp.task('lintScripts', function () {
        return gulp.src(config.files.jsLint)
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'));
    });

    gulp.task('scripts', function () {
        var htmlFilter = filter(config.files.htmlTemplates, {restore: true});

        return gulp.src([
            config.files.renderJS,
            config.files.htmlTemplates,
            '!**/*.spec.js',
            '!**/index.html'
        ])
            .pipe(htmlFilter)
            .pipe(ngHtml2js({
                moduleName: config.files.moduleName,
                declareModule: false
            }))
            .pipe(htmlFilter.restore)
            .pipe(concat(config.appName + '.js'))
            .pipe(wrap('(function () {\n<%= contents %>\n})();'))
            //.pipe(uglify())
            .pipe(gulp.dest(config.dir.dist));
    });
};

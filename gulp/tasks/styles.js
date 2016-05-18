'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    exec = require('child_process').exec,
    notify = require('gulp-notify'),
    gulpif = require('gulp-if'),
    sourcemaps = require('gulp-sourcemaps'),
    postcss = require('gulp-postcss'),
    argv = require('yargs').argv,
    autoprefixer = require('autoprefixer-core'),
    scsslint = require('gulp-scss-lint');

var env = (argv.env !== undefined) ? argv.env.toLowerCase() : 'local';

// ----------------------------
// Error notification methods
// ----------------------------
var beep = function () {
    var os = require('os');
    var file = 'gulp/error.wav';
    if (os.platform() === 'linux') {
        // linux
        exec("aplay " + file);
    } else {
        // mac
        console.log("afplay " + file);
        exec("afplay " + file);
    }
};

var handleError = function (task) {
    return function (err) {
        beep();

        notify.onError({
            message: task + ' failed, check the logs..',
            sound: false
        })(err);

        gutil.log(gutil.colors.bgRed(task + ' error:'), gutil.colors.red(err));
    };
};

module.exports = function (config) {
    //this will fail the build if there is an error
    gulp.task('lintStylesProd', function () {
       return gulp.src(config.files.scss)
            .pipe(scsslint({
                'config': 'scss-lint.yml'
            }))
            .pipe(scsslint.failReporter());
    });

    //this will *NOT* fail the build if there is an error
    gulp.task('lintStylesDev', function () {
        return gulp.src(config.files.scss)
            .pipe(scsslint({
                'config': 'scss-lint.yml'
            }));
    });

    gulp.task('sass', function() {
        var local = env === 'local';

        return gulp.src('./app/src/scss/*.scss')
            .pipe(gulpif(local, sourcemaps.init()))
            .pipe(sass({
                sourceComments: local,
                outputStyle: !local ? 'compressed' : 'expanded'
            }))
            .on('error', handleError('SASS'))
            .pipe(gulpif(local, sourcemaps.write({
                'includeContent': false,
                'sourceRoot': '.'
            })))
            .pipe(gulpif(local, sourcemaps.init({
                'loadMaps': true
            })))
            .pipe(postcss([autoprefixer({browsers: ['last 2 versions', 'IE 9', 'IE 10']})]))
            .pipe(sourcemaps.write({
                'includeContent': true
            }))
            .pipe(rename(config.appName + '.css'))
            .pipe(gulp.dest(config.dir.dist));
    });
};

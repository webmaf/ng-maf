'use strict';

var gulp = require('gulp'),
    config = require('./gulp/config'),
    wrench = require('wrench'),
    util = require('gulp-util'),
    runSequence = require('run-sequence');

wrench.readdirSyncRecursive('./gulp/tasks/').filter(function (file) {
    return (/\.(js)$/i).test(file);
}).map(function (file) {
    require('./gulp/tasks/' + file)(config);
});

util.env.type = 'dev';

gulp.task('copyAllHTML', ['copyHTML', 'copyTemplates']);

gulp.task('local', function () {
    runSequence(
        ['clean'],
        ['lintScripts', 'lintStylesDev', 'karmaDev'],
        ['scripts', 'sass', 'copyConfigJS', 'copyPHP', /*'copyAssets', 'copyVendorFonts', */'copySystem', 'copyAllHTML', 'copyVendorJS'],
        //['browserSyncLocal'],
        ['watch']
    );
});

gulp.task('default', function () {
    runSequence(
        ['local']
    );
});

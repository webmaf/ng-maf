var gulp = require('gulp'),
    Server = require('karma').Server;

module.exports = function (config) {
    gulp.task('karmaDev', function (done) {
        new Server({
            configFile: __dirname + config.karmaConfigLocal
        }, done).start();
    });

    gulp.task('karmaProd', function (done) {
        new Server({
            configFile: __dirname + config.karmaConfigProd
        }, done).start();
    });
};

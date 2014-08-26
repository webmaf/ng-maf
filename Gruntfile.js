module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-connect');

    var userConfig = {
            filesApp: {
                js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
                jsunit: [ 'src/**/*.spec.js' ],

                atpl: [ 'src/app/**/*.tpl.html' ],
                ctpl: [ 'src/common/**/*.tpl.html' ],

                html: [ 'src/index.html' ],
                scss: 'src/scss'
            },
            filesVendor: {
                js: [
                    'vendor/angular/angular.js',
                    'vendor/angular-touch/angular-touch.js',
                    'vendor/angular-route/angular-route.js',
                    'vendor/angular-animate/angular-animate.js',
                    'vendor/angular-xml/angular-xml.js'
                ],
                css: [
                ],
                assets: [
                ]
            }
        };

    var taskConfig = {
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/**\n' +
                ' * <%= pkg.name %> - v<%= pkg.version %>\n' +
                ' * <%= pkg.homepage %>\n' +
                ' */\n'
        },
        clean: {
            build: {
                src: ['build']
            },
            compile: {
                src: ['compile'],
                options: {
                    force: true
                }
            }
        },
        copy: {
            buildAppJs: {
                files: [
                    {
                        src: [ '<%= filesApp.js %>' ],
                        dest: 'build/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            buildVendorJs: {
                files: [
                    {
                        src: [ '<%= filesVendor.js %>' ],
                        dest: 'build/',
                        cwd: '.',
                        expand: true
                    }
                ]
            }
        },
        concat: {
            compile_js: {
                options: {
                    banner: '<%= meta.banner %>',
                    sourceMap: false,
                    stripBanners: false
                },
                src: [
                    '<%= filesVendor.js %>',
                    'module.prefix',
                    'build/src/**/*.js',
                    '<%= html2js.app.dest %>',
                    '<%= html2js.common.dest %>',
                    'module.suffix'
                ],
                dest: 'compile/js/maf.app.js'
            }
        },
        uglify: {
            compile: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                files: {
                    'compile/js/maf.min.js': '<%= concat.compile_js.dest %>'
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'compile/css/screen.min.css': ['compile/css/screen.css']
                }
            }
        },
        html2js: {
            app: {
                options: {
                    base: 'src/app'
                },
                src: [ '<%= filesApp.atpl %>' ],
                dest: 'build/templates-app.js'
            },
            common: {
                options: {
                    base: 'src/common'
                },
                src: [ '<%= filesApp.ctpl %>' ],
                dest: 'build/templates-common.js'
            }
        },
        compass: {
            dev: {
                options: {
                    sassDir: '<%= filesApp.scss %>',
                    cssDir: 'compile/css',
                    imagesDir: 'compile/img',
                    sourcemap: true,
                    environment: 'development'
                }
            },
            production: {
                options: {
                    sassDir: '<%= filesApp.scss %>',
                    cssDir: 'compile/css',
                    imagesDir: 'compile/img',
                    outputStyle: 'compressed',
                    environment: 'production'
                }
            }
        },
        jshint: {
            src: [
                '<%= filesApp.js %>'
            ],
            test: [
                '<%= filesApp.jsunit %>'
            ],
            gruntfile: [
                'Gruntfile.js'
            ],
            options: {
                curly: true,
                immed: true,
                newcap: true,
                noarg: true,
                sub: true,
                boss: true,
                eqnull: true
            },
            globals: {}
        },
        connect: {
            options: {
                port: 9001,
                base: '.',
                keepalive: false,
                debug: false
            },
            rules: [
                {from: '^/assets/(.*)$', to: '/$1'}
            ],
            dev: {
                options: {
                    middleware: function (connect, options, middlewares) {
                        // RewriteRules support
//                        middlewares.unshift(rewriteRulesSnippet);

                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }

                        var directory = options.directory || options.base[options.base.length - 1];
                        options.base.forEach(function (base) {
                            // Serve static files.
                            middlewares.unshift(connect.static(base));
                        });

                        // Make directory browse-able.
                        middlewares.unshift(connect.directory(directory));

                        // enable cross origin calls
                        middlewares.unshift(function (req, res, next) {
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

                            next();
                        });

                        return middlewares;
                    }
                }
            }
        },
        watchTarget: {
            options: {
                livereload: {
                    port: 35729
                }
            },
            jssrc: {
                files: [
                    '<%= filesApp.js %>',
                    '<%= filesApp.jsunit %>'
                ],
                tasks: [
                    'copy:buildAppJs',
                    'copy:buildVendorJs',
                    'concat:compile_js'
                ]
            },
            tpls: {
                files: [
                    '<%= filesApp.atpl %>',
                    '<%= filesApp.ctpl %>'
                ],
                tasks: [
                    'html2js',
                    'concat:compile_js'
                ]
            },
            scss: {
                files: [ 'src/**/*.scss' ],
                tasks: [ 'compass:dev' ]
            }
        }
    };

    grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

    grunt.registerTask('default', [ 'connect:dev', 'watch' ]);

    grunt.renameTask('watch', 'watchTarget');

    grunt.registerTask('watch', [ 'compiledev', 'watchTarget' ]);
    grunt.registerTask('compiledev', [
        'clean:compile',
        'compass:dev',
        'html2js',
        'copy:buildAppJs',
        'copy:buildVendorJs',
        'concat:compile_js'
    ]);

    grunt.registerTask('compileprod', [
        'clean:compile',
        'compass:production',
        //'cssmin',
        'ngAnnotate',
        'uglify'
    ]);

    grunt.registerTask('compile', [
        'clean:build',
        'html2js',
        'copy:buildAppJs',
        'copy:buildVendorJs',
        'jshint:build',
        'compileprod'
    ]);
};

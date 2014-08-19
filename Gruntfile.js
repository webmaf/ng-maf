module.exports = function (grunt) {

    /**
     * Load required Grunt tasks. These are installed based on the versions listed
     * in `package.json` when you do `npm install` in this directory.
     */

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

    var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest,
        userConfig = require('./config/build.config.js');

    /**
     * This is the configuration object Grunt uses to give each plugin its
     * instructions.
     */
    var taskConfig = {
        /**
         * We read in our `package.json` file so we can access the package name and
         * version. It's already there, so we don't repeat ourselves here.
         */
        pkg: grunt.file.readJSON('package.json'),

        meta: {
            banner: '/**\n' +
                ' * <%= pkg.name %> - v<%= pkg.version %>\n' +
                ' * <%= pkg.homepage %>\n' +
                ' */\n'
        },

        clean: {
            build: {
                src: ['<%= build_dir %>']
            },
            compile: {
                src: ['<%= compile_dir %>'],
                options: {
                    force: true
                }
            }
        },

        copy: {
            build_appjs: {
                files: [
                    {
                        src: [ '<%= app_files.js %>' ],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_vendorjs: {
                files: [
                    {
                        src: [ '<%= vendor_files.js %>' ],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            compile_assets: {
                files: [
                    {
                        src: [ '**' ],
                        dest: '<%= compile_dir %>',
                        cwd: 'src/assets',
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
                    '<%= vendor_files.js %>',
                    'module.prefix',
                    '<%= build_dir %>/src/**/*.js',
                    '<%= html2js.app.dest %>',
                    '<%= html2js.common.dest %>',
                    'module.suffix'
                ],
                dest: '<%= compile_dir %>/js/<%= app_js_filname %>.js'
            }
        },

        uglify: {
            compile: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                files: {
                    '<%= compile_dir %>/js/<%= main_js_filname %>.min.js': '<%= concat.compile_alt_js.dest %>'
                }
            }
        },

        cssmin: {
            combine: {
                files: {
                    '<%= compile_dir %>/css/<%= main_css_filname %>.min.css': ['<%= compile_dir %>/css/<%= main_css_filname %>.css']
                }
            }
        },

        html2js: {
            app: {
                options: {
                    base: 'src/app'
                },
                src: [ '<%= app_files.atpl %>' ],
                dest: '<%= build_dir %>/templates-app.js'
            },
            common: {
                options: {
                    base: 'src/common'
                },
                src: [ '<%= app_files.ctpl %>' ],
                dest: '<%= build_dir %>/templates-common.js'
            }
        },

        compass: {
            dev: {
                options: {
                    sassDir: '<%= app_files.scss %>',
                    cssDir: '<%= compile_dir %>/css',
                    fontsDir: '<%= compile_dir %>/fonts',
                    httpFontsPath: '/assets/fonts',
                    imagesDir: '<%= compile_dir %>/img',
                    sourcemap: true,
                    environment: 'development'
                }
            },
            production: {
                options: {
                    sassDir: '<%= app_files.scss %>',
                    cssDir: '<%= compile_dir %>/css',
                    fontsDir: '<%= compile_dir %>/fonts',
                    httpFontsPath: '/assets/fonts',
                    imagesDir: '<%= compile_dir %>/img',
                    outputStyle: 'compressed',
                    environment: 'production'
                }
            }
        },

        jshint: {
            src: [
                '<%= app_files.js %>'
            ],
            test: [
                '<%= app_files.jsunit %>'
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
                port: userConfig.connect_port,
                base: '<%= compile_dir %>',
                keepalive: false,
                debug: false
            },
            rules: userConfig.url_rewrite_rules,
            dev: {
                options: {
                    middleware: function (connect, options, middlewares) {
                        // RewriteRules support
                        middlewares.unshift(rewriteRulesSnippet);

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

        beta: {
            options: {
                livereload: {
                    port: userConfig.livereload_port
                }
            },
            jssrc: {
                files: [
                    '<%= app_files.js %>',
                    '<%= app_files.jsunit %>'
                ],
                tasks: [
                    'copy:build_appjs',
                    'copy:build_vendorjs',
                    'concat:compile_js'
                ]
            },
            assets: {
                files: [
                    'src/assets/**/*'
                ],
                tasks: [ 'copy:compile_assets' ]
            },
            tpls: {
                files: [
                    '<%= app_files.atpl %>',
                    '<%= app_files.ctpl %>'
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

    /**
     * The default task is to build and compile.
     */
    grunt.registerTask('default', [ 'server', 'watch' ]);

    /**
     * In order to make it safe to just compile or copy *only* what was changed,
     * we need to ensure we are starting from a clean, fresh build. So we rename
     * the `watch` task to `delta` (that's why the configuration var above is
     * `delta`) and then add a new task called `watch` that does a clean build
     * before watching for changes.
     */
    grunt.renameTask('watch', 'beta');

    grunt.registerTask('watch', [ 'compiledev', 'beta' ]);

    grunt.registerTask('server', [ /*'configureRewriteRules', */'connect:dev']);

    grunt.registerTask('compiledev', [
        'clean:compile',
        'copy:compile_assets',
        'compass:dev',
        'html2js',
        'copy:build_appjs',
        'copy:build_vendorjs',
        'concat:compile_js'
    ]);

    grunt.registerTask('compileprod', [
        'clean:compile',
        'copy:compile_assets',
        'compass:production',
        //'cssmin',
        'ngAnnotate',
        'uglify'
    ]);

    grunt.registerTask('compile', [
        'clean:build',
        'html2js',
        'copy:build_appjs',
        'copy:build_vendorjs',
        'jshint:build',
        'compileprod'
    ]);

    /**
     * A utility function to get all app JavaScript sources.
     */
    function filterForJS(files) {
        return files.filter(function (file) {
            return file.match(/\.js$/);
        });
    }
};

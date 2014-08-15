module.exports = function (grunt) {

    /**
     * Load required Grunt tasks. These are installed based on the versions listed
     * in `package.json` when you do `npm install` in this directory.
     */
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-connect-rewrite');

    var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;

    /**
     * Default vars and command line config
     */
    var userConfig = require('./config/build.config.js'),

        environments = [
            'DEV',
            'PROD'
        ],
        _locale = grunt.option('locale') || 'en-GB',

        // get UTC in ms
        _now = new Date().getTime().toString();

    // ex. usage: grunt watch --env=DEV || grunt watch --env=PROD
    process.env['NODE_ENV'] = grunt.option('env') || environments[0];


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
        /**
         * The directories to delete when `grunt clean` is executed.
         */
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

        /**
         * The `copy` task just copies files from A to B. We use it here to copy
         * our project assets (images, fonts, etc.) and javascripts into
         * `build_dir`, and then to copy the assets to `compile_dir`.
         */
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

        /**
         * `grunt concat` concatenates multiple source files into a single file.
         */
        concat: {
            /**
             * The `compile_js` target is the concatenation of our application source
             * code and all specified vendor source code into a single file.
             */
            compile_js: {
                options: {
                    banner: '<%= meta.banner %>',
                    sourceMap : true,
                    stripBanners : false
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
            },

            /**
             * Alternative build (included for integration with Neusta -- angular is already included)
             */
            compile_alt_js: {
                options: {
                    banner: '<%= meta.banner %>',
                    sourceMap : true,
                    stripBanners : false
                },
                src: [
                    '<%= vendor_files.js_alt %>',
                    'module.prefix',
                    '<%= build_dir %>/src/**/*.js',
                    '<%= html2js.app.dest %>',
                    '<%= html2js.common.dest %>',
                    'module.suffix'
                ],
                dest: '<%= compile_dir %>/js/<%= main_js_filname %>.js'
            }
        },

        /**
         * `ng-min` annotates the sources before minifying. That is, it allows us
         * to code without the array syntax.
         */
        ngAnnotate: {
            compile: {
                options : {
                    add: true,
                    singleQuotes: true
                },
                files: [
                    {
                        src: [ '<%= concat.compile_alt_js.dest %>' ]
                    }
                ]
            }
        },
        /**
         * Minify the sources!
         */
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


        /**
         * HTML2JS is a Grunt plugin that takes all of your template files and
         * places them into JavaScript files as strings that are added to
         * AngularJS's template cache. This means that the templates too become
         * part of the initial payload as one JavaScript file. Neat!
         */
        html2js: {
            /**
             * These are the templates from `src/app`.
             */
            app: {
                options: {
                    base: 'src/app'
                },
                src: [ '<%= app_files.atpl %>' ],
                dest: '<%= build_dir %>/templates-app.js'
            },

            /**
             * These are the templates from `src/common`.
             */
            common: {
                options: {
                    base: 'src/common'
                },
                src: [ '<%= app_files.ctpl %>' ],
                dest: '<%= build_dir %>/templates-common.js'
            }
        },
        /**
         * `grunt-contrib-compass` handles our SCSS compilation and uglification automatically.
         * Only our `screen.scss` file is included in compilation; all other files
         * must be imported from this file.
         */
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

        /**
         * `jshint` defines the rules of our linter as well as which files we
         * should check. This file, all javascript sources, and all our unit tests
         * are linted based on the policies listed in `options`. But we can also
         * specify exclusionary patterns by prefixing them with an exclamation
         * point (!); this is useful when code comes from a third party but is
         * nonetheless inside `src/`.
         */
        jshint: {
            dev: {
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
            build: {
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
                    eqnull: true,
                    reporter: require('jshint-junit-reporter'),
                    reporterOutput: '<%= reports_dir %>/junit/jshint.xml'
                },
                globals: {}
            }
        },

        /**
         * The Karma configurations.
         */
        karma: {
            options: {
                configFile: '<%= build_dir %>/karma-unit.js',
                port: userConfig.karma_port
            },
            once: {
                singleRun: true
            }

        },

        /**
         * This task compiles the karma template so that changes to its file array
         * don't have to be managed manually.
         */
        karmaconfig: {
            unit: {
                dir: '<%= build_dir %>',
                src: [
                    '<%= vendor_files.js %>',
                    '<%= html2js.app.dest %>',
                    '<%= html2js.common.dest %>',
                    '<%= test_files.js %>'
                ]
            }
        },

        preprocess: {
            dev: {
                options: {
                    context: {
                        ENV : 'DEV',
                        MS : '?' + _now
                    }
                },
                files : {
                    '<%= compile_css_tag %>' : '<%= compile_css_tag_temp %>',
                    '<%= compile_js_tag %>' : '<%= compile_js_tag_temp %>'
                }
            },
            prod: {
                options: {
                    context: {
                        ENV : 'PROD',
                        MS : '?' + _now

                    }
                },
                files : {
                    '<%= compile_css_tag %>' : '<%= compile_css_tag_temp %>',
                    '<%= compile_js_tag %>' : '<%= compile_js_tag_temp %>'
                }
            }
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
                        middlewares.unshift(function(req, res, next) {
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

            /**
             * When our JavaScript source files change, we want to run lint them and
             * run our unit tests.
             */
            jssrc: {
                files: [
                    '<%= app_files.js %>',
                    '<%= app_files.jsunit %>'
                ],
                tasks: [
                    'copy:build_appjs',
                    'copy:build_vendorjs',
                    'concat:compile_js',
                    'concat:compile_alt_js',
                    'karma:once'
                ]
            },
            /**
             * When assets are changed, copy them. Note that this will *not* copy new
             * files, so this is probably not very useful.
             */
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
                    'concat:compile_js',
                    'concat:compile_alt_js'
                ]
            },

            /**
             * When the CSS files change, we need to compile and minify them.
             */
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
    grunt.registerTask('default', [ 'test_dev', 'server', 'watch' ]);


    /**
     * In order to make it safe to just compile or copy *only* what was changed,
     * we need to ensure we are starting from a clean, fresh build. So we rename
     * the `watch` task to `delta` (that's why the configuration var above is
     * `delta`) and then add a new task called `watch` that does a clean build
     * before watching for changes.
     */
    grunt.renameTask('watch', 'beta');

    grunt.registerTask('watch', [ 'compiledev', 'beta' ]);

    grunt.registerTask('server', [ 'configureRewriteRules', 'connect:dev']);

    /*
    * compile task for  development
    * compiles and copies files to the jsp folder but no minification
    * */
    grunt.registerTask('compiledev', [
        'clean:compile',
        'copy:compile_assets',
        'compass:dev',
        'html2js',
        'copy:build_appjs',
        'copy:build_vendorjs',
        'concat:compile_js',
        'concat:compile_alt_js',
        'preprocess:dev'
    ]);

    /**
     * The `compile` task gets your app ready for deployment by concatenating and
     * minifying your code.
     */

    grunt.registerTask('compileprod', [
        'clean:compile',
        'copy:compile_assets',
        'compass:production',
        //'cssmin',
        'concat:compile_alt_js',
        'ngAnnotate',
        'preprocess:prod',
        'uglify'
    ]);

    grunt.registerTask('compile', [
        'test_build',
        'compileprod'
    ]);

    /**
     * Test tasks gets your app ready to run for testing.
     */

    // prepares all files for testing
    grunt.registerTask('build_test', [
        'clean:build',
        'html2js',
        'copy:build_appjs',
        'copy:build_vendorjs',
        'karmaconfig'
    ]);

    // carries out test tasks
    grunt.registerTask('test_dev', [
        'build_test',
        'jshint:dev',
        'karma:once'
    ]);

    grunt.registerTask('test_build', [
        'build_test',
        'jshint:build',
        'karma:once'
    ]);


    /**
     * A utility function to get all app JavaScript sources.
     */
    function filterForJS(files) {
        return files.filter(function (file) {
            return file.match(/\.js$/);
        });
    }


    /**
     * In order to avoid having to specify manually the files needed for karma to
     * run, we use grunt to manage the list for us. The `karma/*` files are
     * compiled as grunt templates for use by Karma. Yay!
     */
    grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function () {

        var jsFiles = filterForJS(this.filesSrc);


        grunt.file.copy('config/karma-unit.tpl.js', grunt.config('build_dir') + '/karma-unit.js', {
            process: function (contents, path) {
                return grunt.template.process(contents, {
                    data: {
                        scripts: jsFiles,
                        reports_dir: grunt.config('reports_dir')
                    }
                });
            }
        });
    });

};

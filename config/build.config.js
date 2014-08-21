/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
    /**
     * The `build_dir` folder is where our projects are compiled during
     * development and the `compile_dir` folder is where our app resides once it's
     * completely built.
     */

    build_dir: 'build',
    tests_dir: 'karma-tests',
    compile_dir: 'compile',
    temp_dir: '.tmp',
    reports_dir: '../WEB-INF/reports',

    /**
     * Ports to listen on
     */
    connect_port: 9001,
    karma_port: 9019,
    livereload_port: 35729,

    /**
     * Rewrites
     * Rewrite URLs on request on static dev server
     */
    url_rewrite_rules: [
        {from: '^/assets/(.*)$', to: '/$1'}
    ],

    /**
     * Filenames
     */

    main_css_filname : 'screen',
    main_js_filname : 'maf',

    // contains angular
    app_js_filname : 'maf.app',

    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `src/`). These file paths are used in the configuration of
     * build tasks. `js` is all project javascript, less tests. `ctpl` contains
     * our reusable components' (`src/common`) template HTML files, while
     * `atpl` contains the same, but for our app's code. `html` is just our
     * main HTML file, `less` is our main stylesheet, and `unit` contains our
     * app's unit tests.
     */
    app_files: {
        js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
        jsunit: [ 'src/**/*.spec.js' ],

        atpl: [ 'src/app/**/*.tpl.html' ],
        ctpl: [ 'src/common/**/*.tpl.html' ],

        html: [ 'src/index.html' ],
        scss: 'src/scss'
    },

    /**
     * This is a collection of files used during testing only.
     */
    test_files: {
        js: [
            'vendor/angular-mocks/angular-mocks.js'
        ]
    },

    /**
     * This is the same as `app_files`, except it contains patterns that
     * reference vendor code (`vendor/`) that we need to place into the build
     * process somewhere. While the `app_files` property ensures all
     * standardized files are collected for compilation, it is the user's job
     * to ensure non-standardized (i.e. vendor-related) files are handled
     * appropriately in `vendor_files.js`.
     *
     * The `vendor_files.js` property holds files to be automatically
     * concatenated and minified with our project source files.
     *
     * The `vendor_files.css` property holds any CSS files to be automatically
     * included in our app.
     *
     * The `vendor_files.assets` property holds any assets to be copied along
     * with our app's assets. This structure is flattened, so it is not
     * recommended that you use wildcards.
     */
    vendor_files: {
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

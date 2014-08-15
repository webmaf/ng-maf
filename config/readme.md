# Explanation of config files

***

## build.config.js
Contains all filepaths used by Grunt, for convenient updating should the project structure change.

## css-tags.js
Contains a conditional statement used by the grunt processor task, which pretty much says: if *ENV = 'DEV'* show the unminified version with source maps, else if *ENV == 'PROD'* a minified/comment-free file will be generated.

Whether the environment is *DEV* or *PROD* is defined in the grunt processor task.

## js-tags.js
See above.

## karma-unit.tpl.js
This template is used to generate a karma config file. Because we're adding/deleting js files all the time, we want to dynamically insert/delete modules in order to test. The generated config file is copied to `poc/frontend/src/main/webapp/ui-src/build/`.

## module-prefix
The start of the anonymous function wrapper for our generator code. We want to encapsulate our javascript to prevent nasty globals!

## module-suffix
See above. This is just the end of the anonymous function wrapper.
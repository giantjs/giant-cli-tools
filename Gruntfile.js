/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'src/namespace.js',
            'src/CliExpectedArgument.js',
            'src/CliExpectedArguments.js',
            'src/CliArgument.js',
            'src/CliOption.js',
            'src/CliFlag.js',
            'src/CliArguments.js',
            'src/Argv.js',
            'src/exports.js'
        ],

        test: [
            'src/jsTestDriver.conf'
        ],

        globals: {}
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};

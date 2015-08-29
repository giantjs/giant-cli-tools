/*global giant, Q */
/*jshint node:true */
giant.postpone(giant, 'CliApplication', function () {
    "use strict";

    var base = giant.Base,
        self = base.extend();

    /**
     * @name giant.CliApplication.create
     * @function
     * @param {string} scriptPath
     * @returns {giant.CliApplication}
     */

    /**
     * @class
     * @extends giant.Base
     */
    giant.CliApplication = self
        .addPrivateMethods(/** @lends CliApplication# */{
            /**
             * @param {string} command
             * @param {string[]} args
             * @param {object} options
             * @returns {*}
             * @private
             */
            _spawnProxy: function (command, args, options) {
                var child_process = require('child_process');
                return child_process.spawn(command, args, options);
            },

            /**
             * @param {*} process
             * @param {string} eventName
             * @param {function} handler
             * @returns {*}
             * @private
             */
            _processOnProxy: function (process, eventName, handler) {
                return process.on(eventName, handler);
            }
        })
        .addMethods(/** @lends giant.CliApplication# */{
            /**
             * @param {string} applicationPath
             * @ignore
             */
            init: function (applicationPath) {
                giant.isString(applicationPath, "Invalid application path");

                /**
                 * Path where the application is located.
                 * @type {string}
                 */
                this.applicationPath = applicationPath;

                /**
                 * Stdout value of last execution.
                 * @type {string}
                 */
                this.stdout = undefined;

                /**
                 * Stderr value of last execution.
                 * @type {string}
                 */
                this.stderr = undefined;

                /**
                 * Error (if any) for the last execution.
                 * @type {*}
                 */
                this.lastError = undefined;
            },

            /**
             * @param {giant.CliArguments} cliArguments
             * @param {object} [processOptions]
             * @returns {Q.promise}
             */
            runCli: function (cliArguments, processOptions) {
                var that = this,
                    scriptProcess = this._spawnProxy(this.applicationPath, cliArguments.getAsArray(), processOptions),
                    deferred = Q.defer();

                this._processOnProxy(scriptProcess, 'error', function (error, stdout, stderr) {
                    that.lastError = error;
                    that.stdout = stdout;
                    that.stderr = stderr;
                    deferred.reject();
                });

                this._processOnProxy(scriptProcess, 'exit', function (error, stdout, stderr) {
                    that.lastError = error;
                    that.stdout = stdout;
                    that.stderr = stderr;
                    deferred.resolve();
                });

                return deferred.promise;
            },

            /**
             * Runs the application multiple times with different argument variations in a serial fashion.
             * @param {CliArguments[]} cliArgumentVariations
             * @param {object} [processOptions]
             * @returns {Q.promise}
             */
            runCliVariants: function (cliArgumentVariations, processOptions) {
                var that = this,
                    deferred = Q.defer(),
                    i = 0;

                (function next() {
                    var cliArguments = cliArgumentVariations[i];
                    that.runCli(cliArguments, processOptions)
                        .then(function () {
                            if (++i < cliArgumentVariations.length) {
                                next();
                                deferred.notify(cliArguments);
                            } else {
                                deferred.resolve();
                            }
                        }, function () {
                            deferred.reject();
                        });
                }());

                return deferred.promise;
            }
        });
});

(function () {
    "use strict";

    giant.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * @returns {giant.CliApplication}
         */
        toCliApplication: function () {
            return giant.CliApplication.create(this.valueOf());
        }
    });
}());

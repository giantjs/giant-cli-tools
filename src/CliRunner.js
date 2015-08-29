/*global giant, Q */
/*jshint node:true */
giant.postpone(giant, 'CliRunner', function () {
    "use strict";

    /**
     * @class
     * @extends giant.Base
     */
    giant.CliRunner = giant.Base.extend()
        .addPrivateMethods(/** @lends CliRunner */{
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
        .addMethods(/** @lends CliRunner */{
            /**
             * @param {string} applicationPath
             * @param {CliArguments} cliArguments
             * @param {object} [processOptions]
             * @returns {Q.promise}
             */
            runCli: function (applicationPath, cliArguments, processOptions) {
                var args = [applicationPath].concat(cliArguments.toString()),
                    scriptProcess = this._spawnProxy('node', args, processOptions),
                    deferred = Q.defer();

                this._processOnProxy(scriptProcess, 'error', function () {
                    deferred.reject();
                });

                this._processOnProxy(scriptProcess, 'exit', function () {
                    deferred.resolve();
                });

                return deferred.promise;
            },

            /**
             * Runs the script with different argument variations in a serial fashion.
             * @param {string} applicationPath
             * @param {CliArguments[]} cliArgumentVariations
             * @param {object} [processOptions]
             * @returns {Q.promise}
             */
            runCliVariants: function (applicationPath, cliArgumentVariations, processOptions) {
                var that = this,
                    deferred = Q.defer(),
                    i = 0;

                (function next() {
                    var cliArguments = cliArgumentVariations[i];
                    that.runCli(applicationPath, cliArguments, processOptions)
                        .finally(function () {
                            deferred.notify(cliArguments);
                        })
                        .then(function () {
                            if (++i < cliArgumentVariations.length) {
                                next();
                            } else {
                                deferred.resolve();
                            }
                        })
                        .catch(function () {
                            deferred.reject();
                        });
                }());

                return deferred.promise;
            }
        });
});

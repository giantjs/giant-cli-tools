/*global giant, Q */
/*jshint node:true */
giant.postpone(giant, 'ScriptRunner', function () {
    "use strict";

    /**
     * @class
     * @extends giant.Base
     */
    giant.ScriptRunner = giant.Base.extend()
        .addPrivateMethods(/** @lends ScriptRunner */{
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
        .addMethods(/** @lends ScriptRunner */{
            /**
             * @param {string} scriptPath
             * @param {CliArguments} cliArguments
             * @param {object} [options]
             * @returns {Q.promise}
             */
            runScript: function (scriptPath, cliArguments, options) {
                var args = [scriptPath].concat(cliArguments.toString()),
                    scriptProcess = this._spawnProxy('node', args, options),
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
             * @param {string} scriptPath
             * @param {CliArguments[]} cliArgumentVariations
             * @returns {Q.promise}
             */
            runScriptVariations: function (scriptPath, cliArgumentVariations) {
                var that = this,
                    deferred = Q.defer(),
                    i = 0;

                (function next() {
                    var cliArguments = cliArgumentVariations[i];
                    that.runScript(scriptPath, cliArguments)
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

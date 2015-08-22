/*global giant */
giant.postpone(giant, 'Script', function () {
    "use strict";

    var base = giant.Base,
        self = base.extend();

    /**
     * @name giant.Script.create
     * @function
     * @param {giant.FilePath} scriptPath
     * @returns {giant.Script}
     */

    /**
     * @class
     * @extends giant.Base
     */
    giant.Script = self
        .addMethods(/** @lends giant.Script# */{
            /**
             * @param {string} scriptPath
             * @ignore
             */
            init: function (scriptPath) {
                giant.isString(scriptPath, "Invalid script path");

                /**
                 * Path where the script is located.
                 * @type {string}
                 */
                this.scriptPath = scriptPath;
            },

            /**
             * @param {giant.CliArguments} cliArguments
             * @param {object} [processOptions]
             * @returns {Q.promise}
             */
            runScript: function (cliArguments, processOptions) {
                return giant.ScriptRunner.runScript(
                    this.scriptPath,
                    cliArguments,
                    processOptions);
            },

            /**
             * @param {CliArguments[]} cliArgumentVariations
             * @param {object} [processOptions]
             * @returns {Q.promise}
             */
            runScriptVariations: function (cliArgumentVariations, processOptions) {
                return giant.ScriptRunner.runScriptVariations(
                    this.scriptPath,
                    cliArgumentVariations,
                    processOptions);
            }
        });
});

(function () {
    "use strict";

    giant.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * @returns {giant.Script}
         */
        toScript: function () {
            return giant.Script.create(this.valueOf());
        }
    });
}());

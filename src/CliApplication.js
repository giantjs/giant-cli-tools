/*global giant */
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
                this.scriptPath = applicationPath;
            },

            /**
             * @param {giant.CliArguments} cliArguments
             * @param {object} [processOptions]
             * @returns {Q.promise}
             */
            runCli: function (cliArguments, processOptions) {
                return giant.CliRunner.runCli(
                    this.scriptPath,
                    cliArguments,
                    processOptions);
            },

            /**
             * @param {CliArguments[]} cliArgumentVariations
             * @param {object} [processOptions]
             * @returns {Q.promise}
             */
            runCliVariants: function (cliArgumentVariations, processOptions) {
                return giant.CliRunner.runCliVariants(
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
         * @returns {giant.CliApplication}
         */
        toCliApplication: function () {
            return giant.CliApplication.create(this.valueOf());
        }
    });
}());

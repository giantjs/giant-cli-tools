/*global giant */
/*jshint node:true */
giant.postpone(giant, 'Argv', function () {
    "use strict";

    var base = giant.Base,
        self = base.extend();

    /**
     * @name giant.Argv.create
     * @function
     * @returns {giant.Argv}
     */

    /**
     * @class
     * @extends giant.Base
     */
    giant.Argv = self
        .addMethods(/** @lends giant.Argv# */{
            /**
             * @param {string[]} argv
             * @ignore
             */
            init: function (argv) {
                $assertion.isArray(argv, "Invalid argv");

                /**
                 * Process argument list.
                 * @type {string[]}
                 */
                this.argv = argv;
            },

            /**
             * Converts Argv instance to CliArguments.
             * The result will only contain user arguments passed to the script.
             * @returns {giant.CliArguments}
             */
            toCliArguments: function () {
                // removing first 2 arguments
                return this.argv.slice(2).toCliArguments();
            }
        });
});

(function () {
    "use strict";

    giant.extendBuiltIn(Array.prototype, /** @lends Array# */{
        /**
         * Converts the array into an Argv instance.
         * @returns {giant.Argv}
         */
        toArgv: function () {
            return giant.Argv.create(this);
        }
    });
}());

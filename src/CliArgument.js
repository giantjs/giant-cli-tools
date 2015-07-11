/*global giant, giant, giant, giant */
giant.postpone(giant, 'CliArgument', function () {
    "use strict";

    var base = giant.Base,
        self = base.extend();

    /**
     * @name giant.CliArgument.create
     * @function
     * @param {string} [argumentStr]
     * @returns {giant.CliArgument}
     */

    /**
     * Represents a single argument of a CLI application, which is
     * either interpreted as a command / flag, or an option.
     * @class
     * @extends giant.Base
     */
    giant.CliArgument = self
        .addMethods(/** @lends giant.CliArgument# */{
            /**
             * @param {string} [argumentStr]
             * @ignore
             */
            init: function (argumentStr) {
                giant.isStringOptional(argumentStr, "Invalid CLI argument string");

                /**
                 * Option name.
                 * @type {string}
                 */
                this.argumentName = undefined;

                /**
                 * Option value.
                 * @type {string}
                 */
                this.argumentValue = undefined;
            },

            /**
             * @param {string} argumentName
             * @returns {giant.CliArgument}
             */
            setArgumentName: function (argumentName) {
                this.argumentName = argumentName;
                return this;
            },

            /**
             * @param {string} argumentValue
             * @returns {giant.CliArgument}
             */
            setArgumentValue: function (argumentValue) {
                this.argumentValue = argumentValue;
                return this;
            }
        });
});

(function () {
    "use strict";

    giant.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * @returns {giant.CliArgument}
             */
            toCliArgument: function () {
                return giant.CliArgument.create(this);
            }
        },
        false, false, false);
}());

/*global giant */
giant.postpone(giant, 'CliExpectedArgument', function () {
    "use strict";

    var base = giant.Base,
        self = base.extend();

    /**
     * @name giant.CliExpectedArgument.create
     * @function
     * @param {string} argumentName
     * @returns {giant.CliExpectedArgument}
     */

    /**
     * @class
     * @extends giant.Base
     */
    giant.CliExpectedArgument = self
        .addMethods(/** @lends giant.CliExpectedArgument# */{
            /**
             * @param {string} argumentName
             * @ignore
             */
            init: function (argumentName) {
                giant.isString(argumentName, "Invalid CLI argument name");

                /**
                 * Identifies the argument.
                 * @type {string}
                 */
                this.argumentName = argumentName;

                /**
                 * Describes the argument to the user.
                 * @type {string}
                 */
                this.argumentDescription = undefined;

                /**
                 * Default value for the argument.
                 * @type {*}
                 */
                this.defaultValue = undefined;
            },

            /**
             * Sets description string for argument. This description will end up in
             * `CliExpectedArguments.getHelpString()`.
             * @param {string} argumentDescription
             * @returns {giant.CliExpectedArgument}
             */
            setArgumentDescription: function (argumentDescription) {
                this.argumentDescription = argumentDescription;
                return this;
            },

            /**
             * Sets default value for the current argument. When an argument has no default
             * value it is treated as mandatory, and will lead to fail argument processing
             * when omitted.
             * @param {*} defaultValue
             * @returns {giant.CliExpectedArgument}
             */
            setDefaultValue: function (defaultValue) {
                this.defaultValue = defaultValue;
                return this;
            },

            /**
             * Tells whether the current argument is marked as mandatory.
             * @returns {boolean}
             */
            isMandatory: function () {
                return typeof this.defaultValue === 'undefined';
            }
        });
});

(function () {
    "use strict";

    giant.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * @returns {giant.CliExpectedArgument}
         */
        toCliExpectedArgument: function () {
            return giant.CliExpectedArgument.create(this.valueOf());
        }
    });
}());

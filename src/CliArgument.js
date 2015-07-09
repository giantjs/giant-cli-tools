/*global dessert, troop, sntls, giant */
troop.postpone(giant, 'CliArgument', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name giant.CliArgument.create
     * @function
     * @param {string} [argumentStr]
     * @returns {giant.CliArgument}
     */

    /**
     * @class
     * @extends troop.Base
     */
    giant.CliArgument = self
        .addConstants(/** @lends CliArgument */{
            /** @constant */
            RE_OPTION: /--([^=]+)=(.*)/
        })
        .addPrivateMethods(/** @lends CliArgument# */{
            /**
             * @param {string} argumentStr
             * @returns {Array}
             * @private
             */
            _extractKeyValuePair: function (argumentStr) {
                var option = this.RE_OPTION.exec(argumentStr);

                if (option && option.length === 3) {
                    // argument is option
                    return option.slice(1);
                } else {
                    // argument is switch
                    return [argumentStr, true];
                }
            }
        })
        .addMethods(/** @lends giant.CliArgument# */{
            /**
             * @param {string} [argumentStr]
             * @ignore
             */
            init: function (argumentStr) {
                dessert.isStringOptional(argumentStr, "Invalid CLI argument string");

                var keyValuePair = argumentStr && this._extractKeyValuePair(argumentStr);

                /**
                 * Option name.
                 * @type {string}
                 */
                this.argumentName = keyValuePair && keyValuePair[0];

                /**
                 * Option value.
                 * @type {string}
                 */
                this.argumentValue = keyValuePair && keyValuePair[1];
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
            },

            /**
             * Converts CLI option back to string.
             * @returns {string}
             */
            toString: function () {
                return this.argumentValue === true ?
                    // command or flag
                    this.argumentName :
                    // option
                    ['--', this.argumentName, '=', this.argumentValue].join('');
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
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

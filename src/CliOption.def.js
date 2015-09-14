/*global giant */
giant.postpone(giant, 'CliOption', function () {
    "use strict";

    var base = giant.CliArgument,
        self = base.extend();

    /**
     * @name giant.CliOption.create
     * @function
     * @param {string} [argumentStr]
     * @returns {giant.CliOption}
     */

    /**
     * @class
     * @extends giant.CliArgument
     */
    giant.CliOption = self
        .addConstants(/** @lends CliOption */{
            /**
             * Defines the pattern an option must adhere to.
             * @constant
             */
            RE_OPTION: /--([^=]+)=(.*)/
        })
        .addMethods(/** @lends giant.CliOption# */{
            /**
             * @param {string} [argumentStr]
             * @ignore
             */
            init: function (argumentStr) {
                base.init.call(this, argumentStr);

                var keyValuePair = argumentStr && self.RE_OPTION.exec(argumentStr);

                giant.assert(keyValuePair, "Malformed option string");

                this.argumentName = keyValuePair[1];
                this.argumentValue = keyValuePair[2];
            },

            /**
             * Converts CLI option back to string.
             * @returns {string}
             */
            toString: function () {
                return ['--', this.argumentName, '=', this.argumentValue].join('');
            }
        });
});

giant.amendPostponed(giant, 'CliArgument', function () {
    "use strict";

    giant.CliArgument
        .addSurrogate(giant, 'CliOption', function (argumentStr) {
            return giant.CliOption.RE_OPTION.test(argumentStr);
        });
});

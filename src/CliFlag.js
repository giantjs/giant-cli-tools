/*global giant */
giant.postpone(giant, 'CliFlag', function () {
    "use strict";

    var base = giant.CliArgument,
        self = base.extend();

    /**
     * @name giant.CliFlag.create
     * @function
     * @param {string} [argumentStr]
     * @returns {giant.CliFlag}
     */

    /**
     * @class
     * @extends giant.CliArgument
     */
    giant.CliFlag = self
        .addMethods(/** @lends giant.CliFlag# */{
            /**
             * @param {string} [argumentStr]
             * @ignore
             */
            init: function (argumentStr) {
                base.init.call(this, argumentStr);

                this.argumentName = argumentStr;
                this.argumentValue = true;
            },

            /**
             * Converts CLI flag back to string.
             * @returns {string}
             */
            toString: function () {
                return this.argumentName;
            }
        });
});

giant.amendPostponed(giant, 'CliArgument', function () {
    "use strict";

    giant.CliArgument
        .addSurrogate(giant, 'CliFlag', function (argumentStr) {
            return typeof argumentStr === 'string' && !giant.CliOption.RE_OPTION.test(argumentStr);
        });
});

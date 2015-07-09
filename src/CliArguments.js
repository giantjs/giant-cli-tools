/*global giant, dessert, troop, sntls */
troop.postpone(giant, 'CliArguments', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name CliArguments.create
     * @function
     * @param {string[]} [argv]
     * @returns {CliArguments}
     */

    /**
     * TODO: Rename to CliArgumentList
     * Implements CLI argument processing.
     * @class
     * @extends troop.Base
     */
    giant.CliArguments = self
        .addPrivateMethods(/** @lends CliArguments# */{
            /**
             * @param {string[]} [argv]
             * @returns {sntls.Collection}
             * @private
             */
            _parseArguments: function (argv) {
                var that = this;
                return sntls.Collection.create(argv)
                    .createWithEachItem(giant.CliArgument)
                    .mapKeys(function (cliArgument) {
                        return cliArgument.argumentName;
                    });
            }
        })
        .addMethods(/** @lends CliArguments# */{
            /**
             * @param {string[]} argv
             * @ignore
             */
            init: function (argv) {
                dessert.isArrayOptional(argv, "Invalid CLI arguments");

                /** @type {sntls.Collection} */
                this.cliArguments = argv ?
                    this._parseArguments(argv) :
                    sntls.Collection.create();
            },

            /**
             * Adds a single argument to the list of arguments.
             * @param {giant.CliArgument} cliArgument
             * @returns {giant.CliArguments}
             */
            addArgument: function (cliArgument) {
                this.cliArguments.setItem(cliArgument.argumentName, cliArgument);
                return this;
            },

            /**
             * Adds multiple arguments to the list of arguments.
             * @param {sntls.Collection} cliArgumentCollection
             * @returns {giant.CliArguments}
             */
            addArguments: function (cliArgumentCollection) {
                // TODO: Use .mergeInto() as soon as available.
                this.cliArguments = this.cliArguments
                    .mergeWith(cliArgumentCollection);
                return this;
            },

            /**
             * Retrieves the value of the specified argument.
             * @param {string} argumentName
             * @returns {string|boolean}
             */
            getArgumentValue: function (argumentName) {
                var cliArgument = this.cliArguments.getItem(argumentName);
                return cliArgument && cliArgument.argumentValue;
            },

            /**
             * Serializes entire argument list.
             * @returns {string}
             */
            toString: function () {
                return this.cliArguments
                    .callOnEachItem('toString')
                    .getSortedValues()
                    .join(' ');
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * @returns {giant.CliArguments}
             */
            toCliArguments: function () {
                return giant.CliArguments.create(this);
            }
        },
        false, false, false);
}());

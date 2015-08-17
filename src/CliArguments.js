/*global giant */
giant.postpone(giant, 'CliArguments', function () {
    "use strict";

    var base = giant.Base,
        self = base.extend();

    /**
     * @name CliArguments.create
     * @function
     * @param {string[]} [argv]
     * @returns {CliArguments}
     */

    /**
     * Implements CLI argument processing.
     * @class
     * @extends giant.Base
     */
    giant.CliArguments = self
        .addPrivateMethods(/** @lends CliArguments# */{
            /**
             * @param {string[]} [argv]
             * @returns {giant.Collection}
             * @private
             */
            _parseArguments: function (argv) {
                return giant.Collection.create(argv)
                    .createWithEachItem(giant.CliArgument)
                    .mapKeys(function (argument) {
                        return argument.argumentName;
                    });
            }
        })
        .addMethods(/** @lends CliArguments# */{
            /**
             * @param {string[]} argv
             * @ignore
             */
            init: function (argv) {
                giant.isArrayOptional(argv, "Invalid CLI arguments");

                /** @type {giant.Collection} */
                this.argumentCollection = argv ?
                    this._parseArguments(argv) :
                    giant.Collection.create();

                /**
                 * Expected arguments. Contains default values.
                 * @type {giant.CliExpectedArguments}
                 */
                this.expectedArguments = undefined;
            },

            /**
             * @param {giant.CliExpectedArguments} expectedArguments
             * @returns {giant.CliArguments}
             */
            setExpectedArguments: function (expectedArguments) {
                this.expectedArguments = expectedArguments;
                return this;
            },

            /**
             * Adds a single argument to the list of arguments.
             * @param {giant.CliArgument} argument
             * @returns {giant.CliArguments}
             */
            addArgument: function (argument) {
                this.argumentCollection.setItem(argument.argumentName, argument);
                return this;
            },

            /**
             * Adds multiple arguments to the list of arguments.
             * @param {giant.Collection} argumentCollection
             * @returns {giant.CliArguments}
             */
            addArguments: function (argumentCollection) {
                // TODO: Use .mergeInto() as soon as available.
                this.argumentCollection = this.argumentCollection
                    .mergeWith(argumentCollection
                        .mapKeys(function (argument) {
                            return argument.argumentName;
                        }));
                return this;
            },

            /**
             * Retrieves the value of the specified argument.
             * @param {string} argumentName
             * @returns {string|boolean}
             */
            getArgumentValue: function (argumentName) {
                var expectedArguments = this.expectedArguments,
                    expectedArgument = expectedArguments && expectedArguments.getItem(argumentName),
                    argument = this.argumentCollection.getItem(argumentName);

                return argument && argument.argumentValue ||
                    expectedArgument && expectedArgument.defaultValue;
            },

            /**
             * Serializes entire argument list.
             * @returns {string}
             */
            toString: function () {
                return this.argumentCollection
                    .callOnEachItem('toString')
                    .getSortedValues()
                    .join(' ');
            }
        });
});

(function () {
    "use strict";

    giant.Properties.addProperties.call(
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

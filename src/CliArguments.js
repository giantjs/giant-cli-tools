/*global giant */
giant.postpone(giant, 'CliArguments', function () {
    "use strict";

    var base = giant.Base,
        self = base.extend();

    /**
     * @name giant.CliArguments.create
     * @function
     * @param {string[]} [argv]
     * @returns {giant.CliArguments}
     */

    /**
     * Implements CLI argument processing.
     * @class
     * @extends giant.Base
     */
    giant.CliArguments = self
        .addPrivateMethods(/** @lends giant.CliArguments# */{
            /**
             * @param {string[]} [asArray]
             * @returns {giant.Collection}
             * @private
             */
            _parseArguments: function (asArray) {
                return giant.Collection.create(asArray)
                    .createWithEachItem(giant.CliArgument)
                    .mapKeys(function (argument) {
                        return argument.argumentName;
                    });
            }
        })
        .addMethods(/** @lends giant.CliArguments# */{
            /**
             * @param {string[]} asArray
             * @ignore
             */
            init: function (asArray) {
                giant.isArrayOptional(asArray, "Invalid CLI arguments");

                /** @type {giant.Collection} */
                this.argumentCollection = asArray ?
                    this._parseArguments(asArray) :
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
             * Returns the number of arguments in the collection.
             * @returns {number}
             */
            getArgumentCount: function () {
                return this.argumentCollection.getKeyCount();
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
             * Returns an array of each argument serialized.
             * @returns {string[]}
             */
            getAsArray: function () {
                return this.argumentCollection
                    .callOnEachItem('toString')
                    .getSortedValues();
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

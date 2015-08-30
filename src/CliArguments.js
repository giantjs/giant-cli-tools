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
             * @private
             */
            _parseArguments: function (asArray) {
                var argumentChain = giant.OpenChain.create(),
                    arrayLength = asArray && asArray.length || 0,
                    i, cliArgument, cliArgumentLink;

                // adding attributes to chain
                for (i = 0; i < arrayLength; i++) {
                    cliArgument = asArray[i].toCliArgument();
                    cliArgumentLink = giant.ValueLink.create()
                        .setValue(cliArgument);
                    argumentChain.pushLink(cliArgumentLink);
                }

                this.argumentChain = argumentChain;

                this.argumentLookup = asArray ?
                    argumentChain.getValues()
                        .toCollection()
                        .mapKeys(function (cliArgument) {
                            return cliArgument.argumentName;
                        }) :
                    giant.Collection.create();
            }
        })
        .addMethods(/** @lends giant.CliArguments# */{
            /**
             * @param {string[]} asArray
             * @ignore
             */
            init: function (asArray) {
                giant.isArrayOptional(asArray, "Invalid CLI arguments");

                /**
                 * Stores associations between argument names and corresponding argument instances.
                 * @type {giant.Collection}
                 */
                this.argumentLookup = undefined;

                /**
                 * Stores argument instances in a chain structure.
                 * @type {giant.OpenChain}
                 */
                this.argumentChain = undefined;

                /**
                 * Expected arguments. Contains default values.
                 * @type {giant.CliExpectedArguments}
                 */
                this.expectedArguments = undefined;

                this._parseArguments(asArray);
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
                this.argumentChain.pushValue(argument);
                this.argumentLookup.setItem(argument.argumentName, argument);
                return this;
            },

            /**
             * Adds multiple arguments to the list of arguments.
             * @param {giant.Collection} argumentCollection
             * @returns {giant.CliArguments}
             */
            addArguments: function (argumentCollection) {
                var argumentChain = this.argumentChain;

                argumentCollection.forEachItem(function (/*giant.CliArgument*/argument) {
                    argumentChain.pushValue(argument);
                });

                // TODO: Use .mergeInto() as soon as available.
                this.argumentLookup = this.argumentLookup
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
                return this.argumentLookup.getKeyCount();
            },

            /**
             * Retrieves the value of the specified argument.
             * @param {string} argumentName
             * @returns {string|boolean}
             */
            getArgumentValue: function (argumentName) {
                var expectedArguments = this.expectedArguments,
                    expectedArgument = expectedArguments && expectedArguments.getItem(argumentName),
                    argument = this.argumentLookup.getItem(argumentName);

                return argument && argument.argumentValue ||
                    expectedArgument && expectedArgument.defaultValue;
            },

            /**
             * Returns an array of each argument serialized.
             * @returns {string[]}
             */
            getAsArray: function () {
                return this.argumentChain
                    .getValues()
                    .toCollection()
                    .callOnEachItem('toString')
                    .items;
            },

            /**
             * Serializes entire argument list.
             * @returns {string}
             */
            toString: function () {
                return this.argumentChain
                    .getValues()
                    .toCollection()
                    .callOnEachItem('toString')
                    .items
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

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
     * Implements CLI argument processing.
     * TODO: Add commands & switches.
     * @class
     * @extends troop.Base
     */
    giant.CliArguments = self
        .addConstants(/** @lends CliArguments */{
            /** @constant */
            RE_OPTION: /--([^=]+)=(.*)/
        })
        .addPrivateMethods(/** @lends CliArguments# */{
            /**
             * @param {string[]} [argv]
             * @returns {sntls.Collection}
             * @private
             */
            _extractOptions: function (argv) {
                var that = this;
                return sntls.Collection.create(argv)
                    .filterBySelector(function (arg) {
                        return that.RE_OPTION.test(arg);
                    })
                    .mapValues(function (option) {
                        return that.RE_OPTION.exec(option).slice(1);
                    })
                    .mapKeys(function (optionKvp) {
                        return optionKvp[0];
                    })
                    .mapValues(function (optionKvp) {
                        return optionKvp[1];
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
                this.options = argv ?
                    this._extractOptions(argv) :
                    sntls.Collection.create();
            },

            /**
             * @param {string} optionName
             * @param {string|*} optionValue
             * @returns {CliArguments}
             */
            setOption: function (optionName, optionValue) {
                this.options.setItem(optionName, optionValue);
                return this;
            },

            /**
             * @param {sntls.Collection} options
             * @returns {CliArguments}
             */
            addOptions: function (options) {
                // TODO: Use .mergeInto() as soon as available.
                this.options = this.options.mergeWith(options);
                return this;
            },

            /**
             * @param {string} optionName
             * @returns {string}
             */
            getOption: function (optionName) {
                return this.options.getItem(optionName);
            },

            /**
             * Retrieves an array of options that may be passed to a CLI.
             * TODO: Should use CliOption.toString() class.
             * TODO: Should include commands & switches when done
             * @returns {string[]}
             */
            getAsArguments: function () {
                return this.options
                    .mapValues(function (optionValue, optionKey) {
                        return '--' + optionKey + '=' + optionValue;
                    })
                    .getSortedValues();
            },

            /**
             * @returns {string}
             */
            toString: function () {
                return this.getAsArguments().join(' ');
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

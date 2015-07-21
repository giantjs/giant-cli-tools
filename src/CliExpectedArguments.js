/*global giant */
giant.postpone(giant, 'CliExpectedArguments', function () {
    "use strict";

    /**
     * @name giant.CliExpectedArguments.create
     * @function
     * @param {object|Array} [items]
     * @returns {giant.CliExpectedArguments}
     */

    /**
     * @class
     * @extends giant.Collection
     * @extends giant.CliExpectedArgument
     */
    giant.CliExpectedArguments = giant.Collection.of(giant.CliExpectedArgument)
        .addPrivateMethods(/** @lends giant.CliExpectedArguments# */{
            /**
             *
             * @param {giant.Set} newArgumentSet
             * @private
             */
            _addNewArguments: function (newArgumentSet) {
                var that = this;
                return newArgumentSet
                    .subtract(this.toSet())
                    .getKeysAsHash()
                    .toCollection()
                    .forEachItem(function (newArgumentName) {
                        that.setItem(newArgumentName, newArgumentName.toCliExpectedArgument());
                    });
            }
        })
        .addMethods(/** @lends giant.CliExpectedArguments# */{
            /**
             * Sets description for each argument.
             * @param {object} argumentDescriptions Default argument descriptions
             * indexed by argument names.
             * @returns {giant.CliExpectedArguments}
             */
            setArgumentDescriptions: function (argumentDescriptions) {
                this._addNewArguments(giant.Set.create(argumentDescriptions));

                var that = this;

                giant.Collection.create(argumentDescriptions)
                    .forEachItem(function (argumentDescription, argumentName) {
                        that.getItem(argumentName)
                            .setArgumentDescription(argumentDescription);
                    });

                return this;
            },

            /**
             * Sets default value for each argument.
             * @param {object} defaultValues Default argument values indexed by argument names.
             * @returns {giant.CliExpectedArguments}
             */
            setDefaultValues: function (defaultValues) {
                this._addNewArguments(giant.Set.create(defaultValues));

                var that = this;

                giant.Collection.create(defaultValues)
                    .forEachItem(function (defaultValue, argumentName) {
                        that.getItem(argumentName)
                            .setDefaultValue(defaultValue);
                    });

                return this;
            },

            /**
             * Returns a descriptive string about the expected arguments including their name,
             * description, and default value. This string is suitable to be included in
             * a help string.
             * @returns {string}
             */
            getHelpString: function () {
                var mandatoryArguments = this
                        .filterBySelector(function (cliExpectedArgument) {
                            return cliExpectedArgument.isMandatory();
                        }),
                    optionalArguments = this
                        .filterBySelector(function (cliExpectedArgument) {
                            return !cliExpectedArgument.isMandatory();
                        });

                return [
                    mandatoryArguments.getKeyCount() ?
                        [
                            "Mandatory arguments:",
                            mandatoryArguments
                                .mapValues(function (cliExpectedArgument, argumentName) {
                                    return " " + argumentName + " : " + cliExpectedArgument.argumentDescription;
                                })
                                .getValues()
                                .join('\n'),
                            "",
                            ""
                        ].join('\n') :
                        undefined,

                    optionalArguments.getKeyCount() ?
                        [
                            "Optional arguments [default value]:",
                            optionalArguments
                                .mapValues(function (cliExpectedArgument, argumentName) {
                                    return [
                                        "",
                                        argumentName, ":", cliExpectedArgument.argumentDescription,
                                        "[" + cliExpectedArgument.defaultValue + "]"
                                    ].join(" ");
                                })
                                .getValues()
                                .join('\n'),
                            ""
                        ].join('\n') :
                        undefined
                ].join('');
            }
        });
});

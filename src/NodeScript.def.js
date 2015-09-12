/*global giant */
giant.postpone(giant, 'NodeScript', function () {
    "use strict";

    var base = giant.CliApplication,
        self = base.extend();

    /**
     * @name giant.NodeScript.create
     * @function
     * @param {string} scriptPath
     * @returns {giant.NodeScript}
     */

    /**
     * @class
     * @extends giant.CliApplication
     */
    giant.NodeScript = self
        .addConstants(/** @lends giant.NodeScript */{
            /**
             * @type {RegExp}
             * @constant
             */
            RE_JAVASCRIPT_PATH: /.*\.js$/
        })
        .addMethods(/** @lends giant.NodeScript# */{
            /**
             * @param {string} scriptPath
             * @ignore
             */
            init: function (scriptPath) {
                giant.assert(this.RE_JAVASCRIPT_PATH.test(scriptPath), "Invalid node script path");

                base.init.call(this, 'node');

                /** @type {string} */
                this.scriptPath = scriptPath;
            },

            /**
             * @param {giant.CliArguments} cliArguments
             * @param {object} [processOptions]
             * @returns {Q.promise}
             */
            runCli: function (cliArguments, processOptions) {
                return base.runCli.call(
                    this,
                    // appending arguments to script path
                    [this.scriptPath].toCliArguments()
                        .appendArguments(cliArguments),
                    processOptions);
            }
        });
});

giant.amendPostponed(giant, 'CliApplication', function () {
    "use strict";

    giant.CliApplication
        .addSurrogate(giant, 'NodeScript', function (applicationPath) {
            return giant.NodeScript.RE_JAVASCRIPT_PATH.test(applicationPath);
        });
});

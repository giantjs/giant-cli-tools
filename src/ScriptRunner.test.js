/*global giant, Q */
/*global module, test, asyncTest, start, expect, ok, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
/*global ScriptRunner */
(function () {
    "use strict";

    module("ScriptRunner");

    asyncTest("Running script", function () {
        expect(6);

        var process = {},
            processOptions = {},
            exit;

        giant.ScriptRunner.addMocks({
            _spawnProxy: function (command, args, options) {
                equal(command, 'node', "should pass node as command");
                deepEqual(args, ['foo.js', '--hello=world'], "should pass script arguments");
                strictEqual(options, processOptions, "should pass options");
                return process;
            },

            _processOnProxy: function (_process, eventName, handler) {
                // will be hit 2x
                strictEqual(_process, process, "should subscribe on spawned process");
                if (eventName === 'exit') {
                    exit = handler;
                }
            }
        });

        giant.ScriptRunner.runScript('foo.js', ['--hello=world'].toCliArguments(), processOptions)
            .finally(function () {
                ok(true, "should return promise");

                giant.ScriptRunner.removeMocks();

                start();
            });

        exit();
    });

    asyncTest("Running script with a set of arguments", function () {
        expect(2);

        var cliArgVariations = [
                ['--foo=bar'].toCliArguments(),
                ['--hello=world'].toCliArguments()
            ],
            runScriptParams = [];

        giant.ScriptRunner.addMocks({
            runScript: function (scriptPath, cliArguments) {
                runScriptParams.push([scriptPath, cliArguments.toString()]);
                var deferred = Q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        });

        giant.ScriptRunner.runScriptVariations('baz.js', cliArgVariations)
            .finally(function () {
                ok(true, "should return promise");

                deepEqual(runScriptParams, [
                    ['baz.js', '--foo=bar'],
                    ['baz.js', '--hello=world']
                ], "should run scripts for all argument variations");

                giant.ScriptRunner.removeMocks();

                start();
            });
    });
}());

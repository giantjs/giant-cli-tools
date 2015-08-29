/*global giant, Q */
/*global module, test, asyncTest, start, expect, ok, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("CliRunner");

    asyncTest("Running app", function () {
        expect(6);

        var process = {},
            processOptions = {},
            exit;

        giant.CliRunner.addMocks({
            _spawnProxy: function (command, args, options) {
                equal(command, 'node', "should pass node as command");
                deepEqual(args, ['foo.js', '--hello=world'], "should pass CLI arguments");
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

        giant.CliRunner.runCli('foo.js', ['--hello=world'].toCliArguments(), processOptions)
            .finally(function () {
                ok(true, "should return promise");

                giant.CliRunner.removeMocks();

                start();
            });

        exit();
    });

    asyncTest("Running app with a set of arguments", function () {
        expect(2);

        var cliArgVariations = [
                ['--foo=bar'].toCliArguments(),
                ['--hello=world'].toCliArguments()
            ],
            runScriptParams = [];

        giant.CliRunner.addMocks({
            runCli: function (scriptPath, cliArguments) {
                runScriptParams.push([scriptPath, cliArguments.toString()]);
                var deferred = Q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        });

        giant.CliRunner.runCliVariants('baz.js', cliArgVariations)
            .finally(function () {
                ok(true, "should return promise");

                deepEqual(runScriptParams, [
                    ['baz.js', '--foo=bar'],
                    ['baz.js', '--hello=world']
                ], "should run scripts for all argument variations");

                giant.CliRunner.removeMocks();

                start();
            });
    });
}());

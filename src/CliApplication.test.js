/*global giant, Q */
/*global module, test, asyncTest, start, expect, ok, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("CliApplication");

    test("Instantiation", function () {
        raises(function () {
            giant.CliApplication.create();
        }, "should raise exception on missing arguments");

        var app = giant.CliApplication.create('foo.js');

        equal(app.applicationPath, 'foo.js', "should set applicationPath property");
        equal(app.stdout, undefined, "should add stdout property");
        equal(app.stderr, undefined, "should add stderr property");
        equal(app.lastError, undefined, "should add lastError property");
    });

    test("Conversion from string", function () {
        var app = 'foo.js'.toCliApplication();

        ok(app.isA(giant.CliApplication), "should return CliApplication instance");
        equal(app.applicationPath, 'foo.js', "should set applicationPath property");
    });

    asyncTest("CliApplication runner", function () {
        expect(8);

        var app = 'foo.js'.toCliApplication(),
            process = {},
            processOptions = {},
            exit;

        app.addMocks({
            _spawnProxy: function (command, args, options) {
                equal(command, 'foo.js', "should pass node as command");
                deepEqual(args, ['--hello=world'], "should pass CLI arguments");
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

        app.runCli(['--hello=world'].toCliArguments(), processOptions)
            .then(function () {
                equal(app.stdout, 'O', "should set stdout property");
                equal(app.stderr, 'E', "should set stderr property");
                equal(app.lastError, 'err', "should set lastError property");
                start();
            });

        exit('err', 'O', 'E');
    });

    asyncTest("CliApplication variations runner", function () {
        expect(1);

        var app = 'foo.js'.toCliApplication(),
            cliArgVariations = [
                ['--foo=bar'].toCliArguments(),
                ['--hello=world'].toCliArguments()
            ],
            runScriptParams = [];

        app.addMocks({
            runCli: function (cliArguments) {
                runScriptParams.push(cliArguments.toString());
                var deferred = Q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        });

        app.runCliVariants(cliArgVariations)
            .then(function () {
                deepEqual(runScriptParams, [
                    '--foo=bar',
                    '--hello=world'
                ], "should run scripts for all argument variations");

                start();
            });
    });
}());
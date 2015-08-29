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

        equal(app.scriptPath, 'foo.js', "should set scriptPath property");
    });

    test("Conversion from string", function () {
        var app = 'foo.js'.toCliApplication();

        ok(app.isA(giant.CliApplication), "should return CliApplication instance");
        equal(app.scriptPath, 'foo.js', "should set scriptPath property");
    });

    test("CliApplication runner", function () {
         expect(4);

        var app = 'foo.js'.toCliApplication(),
            result = {};

        giant.CliRunner.addMocks({
            runCli: function (scriptPath, cliArguments, processOptions) {
                equal(scriptPath, app.scriptPath, "should pass app path");
                deepEqual(cliArguments.argumentCollection.items, {
                    bar: 'bar'.toCliArgument(),
                    baz: 'baz'.toCliArgument()
                }, "should pass CLI arguments");
                deepEqual(processOptions, {}, "should pass process options");
                return result;
            }
        });

        strictEqual(app.runCli(['bar', 'baz'].toCliArguments(), {}), result,
            "should return whatever CliRunner returned");

        giant.CliRunner.removeMocks();
    });

    test("CliApplication variations runner", function () {
         expect(5);

        var app = 'foo.js'.toCliApplication(),
            result = {};

        giant.CliRunner.addMocks({
            runCliVariants: function (scriptPath, cliArgumentVariations, processOptions) {
                equal(scriptPath, app.scriptPath, "should pass app path");
                equal(cliArgumentVariations.length, 1);
                deepEqual(cliArgumentVariations[0].argumentCollection.items, {
                    bar: 'bar'.toCliArgument(),
                    baz: 'baz'.toCliArgument()
                }, "should pass CLI arguments");
                deepEqual(processOptions, {}, "should pass process options");
                return result;
            }
        });

        strictEqual(app.runCliVariants([['bar', 'baz'].toCliArguments()], {}), result,
            "should return whatever CliRunner returned");

        giant.CliRunner.removeMocks();
    });
}());

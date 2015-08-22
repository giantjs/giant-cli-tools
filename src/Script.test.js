/*global giant, Q */
/*global module, test, asyncTest, start, expect, ok, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Script");

    test("Instantiation", function () {
        raises(function () {
            giant.Script.create();
        }, "should raise exception on missing arguments");

        var script = giant.Script.create('foo.js');

        equal(script.scriptPath, 'foo.js', "should set scriptPath property");
    });

    test("Conversion from string", function () {
        var script = 'foo.js'.toScript();

        ok(script.isA(giant.Script), "should return Script instance");
        equal(script.scriptPath, 'foo.js', "should set scriptPath property");
    });

    test("Script runner", function () {
         expect(4);

        var script = 'foo.js'.toScript(),
            result = {};

        giant.ScriptRunner.addMocks({
            runScript: function (scriptPath, cliArguments, processOptions) {
                equal(scriptPath, script.scriptPath, "should pass script path");
                deepEqual(cliArguments.argumentCollection.items, {
                    bar: 'bar'.toCliArgument(),
                    baz: 'baz'.toCliArgument()
                }, "should pass CLI arguments");
                deepEqual(processOptions, {}, "should pass process options");
                return result;
            }
        });

        strictEqual(script.runScript(['bar', 'baz'].toCliArguments(), {}), result,
            "should return whatever ScriptRunner returned");

        giant.ScriptRunner.removeMocks();
    });

    test("Script variations runner", function () {
         expect(5);

        var script = 'foo.js'.toScript(),
            result = {};

        giant.ScriptRunner.addMocks({
            runScriptVariations: function (scriptPath, cliArgumentVariations, processOptions) {
                equal(scriptPath, script.scriptPath, "should pass script path");
                equal(cliArgumentVariations.length, 1);
                deepEqual(cliArgumentVariations[0].argumentCollection.items, {
                    bar: 'bar'.toCliArgument(),
                    baz: 'baz'.toCliArgument()
                }, "should pass CLI arguments");
                deepEqual(processOptions, {}, "should pass process options");
                return result;
            }
        });

        strictEqual(script.runScriptVariations([['bar', 'baz'].toCliArguments()], {}), result,
            "should return whatever ScriptRunner returned");

        giant.ScriptRunner.removeMocks();
    });
}());

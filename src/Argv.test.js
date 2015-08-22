/*global giant */
/*global module, test, asyncTest, start, expect, ok, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Argv");

    test("Instantiation", function () {
        raises(function () {
            giant.Argv.create(654);
        }, "should raise exception on invalid arguments");

        var argv = giant.Argv.create(['foo', 'bar']);

        deepEqual(argv.argv, ['foo', 'bar'], "should set argv property");
    });

    test("Conversion from array", function () {
        var argv = ['foo', 'bar'].toArgv();

        ok(argv.isA(giant.Argv), "should return CliArgument instance");
        deepEqual(argv.argv, ['foo', 'bar'], "should set argv property");
    });

    test("Conversion to CliArguments", function () {
        var argv = ['foo', 'bar', 'baz'].toArgv(),
            result = argv.toCliArguments();

        ok(result.isA(giant.CliArguments), "should return CliArgument instance");
        deepEqual(result.argumentCollection.items, {
            baz: 'baz'.toCliArgument()
        }, "should exclude first 2 arguments");
    });
}());
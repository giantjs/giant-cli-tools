/*global giant, giant, giant, giant */
/*global module, test, asyncTest, start, expect, ok, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("CliArguments");

    test("Instantiation with argv", function () {
        var parsedArguments = {};

        giant.CliArguments.addMocks({
            _parseArguments: function (argv) {
                deepEqual(argv, ['foo', 'bar', '--baz=qux'], "should parse arguments");
                return parsedArguments;
            }
        });

        var args = giant.CliArguments.create(['foo', 'bar', '--baz=qux']);

        giant.CliArguments.removeMocks();

        strictEqual(args.cliArguments, parsedArguments, "should set parsed arguments");
    });

    test("Instantiation without argv", function () {
        var args = giant.CliArguments.create();

        deepEqual(args.cliArguments.items, {}, "should set options collection property");
    });

    test("Conversion from array", function () {
        var args = ['foo', 'bar', '--baz=qux'].toCliArguments();

        ok(args.isA(giant.CliArguments), "should return giant.CliArguments instance");
    });

    test("Serialization", function () {
        var args = ['--foo=bar', '--baz=qux', 'hello'].toCliArguments();

        clearInterval(args.toString());
        equal(args.toString(), '--baz=qux --foo=bar hello', "should re-assemble options");
    });
}());

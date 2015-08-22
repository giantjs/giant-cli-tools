/*global giant */
/*global module, test, asyncTest, start, expect, ok, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("CliArguments");

    test("Instantiation with argv", function () {
        var argumentCollection = {};

        giant.CliArguments.addMocks({
            _parseArguments: function (argv) {
                deepEqual(argv, ['foo', 'bar', '--baz=qux'], "should parse arguments");
                return argumentCollection;
            }
        });

        var args = giant.CliArguments.create(['foo', 'bar', '--baz=qux']);

        giant.CliArguments.removeMocks();

        strictEqual(args.argumentCollection, argumentCollection, "should set parsed arguments");
        equal(typeof args.expectedArguments, 'undefined', "should add expectedArguments property");
    });

    test("Instantiation without argv", function () {
        var args = giant.CliArguments.create();

        deepEqual(args.argumentCollection.items, {}, "should set options collection property");
    });

    test("Conversion from array", function () {
        var args = ['foo', 'bar', '--baz=qux'].toCliArguments();

        ok(args.isA(giant.CliArguments), "should return giant.CliArguments instance");
    });

    test("Expected arguments setter", function () {
        var args = ['foo', 'bar', '--baz=qux'].toCliArguments(),
            expectedArgs = giant.CliExpectedArguments.create()
                .setDefaultValues({
                    'bar': 'hello'
                });

        strictEqual(args.setExpectedArguments(expectedArgs), args, "should be chainable");
        strictEqual(args.expectedArguments, expectedArgs,
            "should set expectedArguments property");
    });

    test("Argument addition", function () {
        var args = ['foo', 'bar', '--baz=qux'].toCliArguments(),
            arg = 'foo'.toCliArgument();

        strictEqual(args.addArgument(arg), args, "should be chainable");
        strictEqual(args.argumentCollection.getItem('foo'), arg,
            "should set argument in collection");
    });

    test("Multiple argument addition", function () {
        var args = [].toCliArguments(),
            argCollection = [
                'foo'.toCliArgument(),
                'bar'.toCliArgument()
            ].toCollection();

        strictEqual(args.addArguments(argCollection), args, "should be chainable");
        deepEqual(args.argumentCollection.items, {
            foo: 'foo'.toCliArgument(),
            bar: 'bar'.toCliArgument()
        }, "should set arguments in collection");
    });

    test("Argument count getter", function () {
        equal(['foo', 'bar', '--baz=qux'].toCliArguments().getArgumentCount(), 3,
            "should return number of arguments");
        equal(giant.CliArguments.create().getArgumentCount(), 0,
            "should return zero for empty argument list");
    });

    test("Argument value getter", function () {
        var args = ['foo', '--bar=', '--baz=', '--hello=world'].toCliArguments()
            .setExpectedArguments(giant.CliExpectedArguments.create()
                .setDefaultValues({
                    'bar': 'hello'
                }));

        equal(args.getArgumentValue('hello'), 'world', "should return specified arguments");
        equal(args.getArgumentValue('foo'), true, "should return true for flags");
        equal(args.getArgumentValue('bar'), 'hello',
            "should return default argument where specified");
        equal(typeof args.getArgumentValue('baz'), 'undefined',
            "should return undefined where no value nor default is given");
    });

    test("Serialization", function () {
        var args = ['--foo=bar', '--baz=qux', 'hello'].toCliArguments();

        clearInterval(args.toString());
        equal(args.toString(), '--baz=qux --foo=bar hello', "should re-assemble options");
    });
}());

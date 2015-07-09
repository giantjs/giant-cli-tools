/*global dessert, troop, sntls, giant */
/*global module, test, asyncTest, start, expect, ok, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("CliArgument");

    test("Instantiation", function () {
        raises(function () {
            giant.CliArgument.create(654);
        }, "should raise exception on invalid arguments");

        var cliArgument = giant.CliArgument.create();

        ok(cliArgument.hasOwnProperty('argumentName'), "should add argumentName property");
        equal(typeof cliArgument.argumentName, 'undefined', "should set argumentName to undefined");
        ok(cliArgument.hasOwnProperty('argumentValue'), "should add argumentValue property");
        equal(typeof cliArgument.argumentValue, 'undefined', "should set argumentValue to undefined");
    });

    test("Instantiation with flag", function () {
        var cliArgument = giant.CliArgument.create('foo');

        equal(cliArgument.argumentName, 'foo', "should set argumentName");
        equal(cliArgument.argumentValue, true, "should set argumentValue to true");
    });

    test("Instantiation with option", function () {
        var cliArgument = giant.CliArgument.create('--foo=bar');

        equal(cliArgument.argumentName, 'foo', "should set argumentName");
        equal(cliArgument.argumentValue, 'bar', "should set argumentValue");
    });

    test("Conversion from flag string", function () {
        var cliArgument = 'foo'.toCliArgument();

        ok(cliArgument.isA(giant.CliArgument), "should return CliArgument instance");
        equal(cliArgument.argumentName, 'foo', "should set argumentName");
        equal(cliArgument.argumentValue, true, "should set argumentValue to true");
    });

    test("Conversion from option string", function () {
        var cliArgument = '--foo=bar'.toCliArgument();

        ok(cliArgument.isA(giant.CliArgument), "should return CliArgument instance");
        equal(cliArgument.argumentName, 'foo', "should set argumentName");
        equal(cliArgument.argumentValue, 'bar', "should set argumentValue");
    });

    test("Argument name setter", function () {
        var cliArgument = giant.CliArgument.create();

        strictEqual(cliArgument.setArgumentName('foo'), cliArgument, "should be chainable");
        equal(cliArgument.argumentName, 'foo', "should set argumentName property");
    });

    test("Argument value setter", function () {
        var cliArgument = giant.CliArgument.create();

        strictEqual(cliArgument.setArgumentValue('bar'), cliArgument, "should be chainable");
        equal(cliArgument.argumentValue, 'bar', "should set argumentValue property");
    });

    test("Serialization", function () {
        equal('foo'.toCliArgument().toString(), 'foo', "should return argument name for flag");
        equal('--foo=bar'.toCliArgument().toString(), '--foo=bar',
            "should return option assignment for option");
    });
}());

/*global dessert, troop, sntls, giant */
/*global module, test, asyncTest, start, expect, ok, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("CliOption");

    test("Instantiation", function () {
        var cliArgument = giant.CliFlag.create('foo');

        equal(cliArgument.argumentName, 'foo', "should set argumentName");
        equal(cliArgument.argumentValue, true, "should set argumentValue");
    });

    test("CliArgument surrogate", function () {
        var cliArgument = giant.CliArgument.create('foo');

        ok(cliArgument.isA(giant.CliFlag), "should return CliFlag instance");
        equal(cliArgument.argumentName, 'foo', "should set argumentName");
        equal(cliArgument.argumentValue, true, "should set argumentValue");
    });

    test("Serialization", function () {
        equal('foo'.toCliArgument().toString(), 'foo', "should return flag name");
    });
}());

/*global dessert, troop, sntls, giant */
/*global module, test, asyncTest, start, expect, ok, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("CliOption");

    test("Instantiation", function () {
        var cliArgument = giant.CliOption.create('--foo=bar');

        equal(cliArgument.argumentName, 'foo', "should set argumentName");
        equal(cliArgument.argumentValue, 'bar', "should set argumentValue");
    });

    test("CliArgument surrogate", function () {
        var cliArgument = giant.CliArgument.create('--foo=bar');

        ok(cliArgument.isA(giant.CliOption), "should return CliOption instance");
        equal(cliArgument.argumentName, 'foo', "should set argumentName");
        equal(cliArgument.argumentValue, 'bar', "should set argumentValue");
    });

    test("Serialization", function () {
        equal('--foo=bar'.toCliArgument().toString(), '--foo=bar',
            "should return option assignment for option");
    });
}());

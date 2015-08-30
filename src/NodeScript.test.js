/*global giant */
/*global module, test, asyncTest, start, expect, ok, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("NodeScript");

    test("Instantiation", function () {
        raises(function () {
            giant.NodeScript.create();
        }, "should raise exception on missing arguments");

        raises(function () {
            giant.NodeScript.create('foo');
        }, "should raise exception on invalid arguments");

        var nodeScript = giant.NodeScript.create('foo.js');

        equal(nodeScript.applicationPath, 'node', "should set node as applicationPath");
        equal(nodeScript.scriptPath, 'foo.js', "should set script path as scriptPath");
    });

    test("CliApplication surrogate", function () {
        var nodeScript = giant.CliApplication.create('foo.js');
        ok(nodeScript.isA(giant.NodeScript), "should return NodeScript instance");
    });

    test("Running script", function () {
        expect(3);

        var script = giant.NodeScript.create('foo.js'),
            processOptions = {},
            result = {};

        giant.CliApplication.addMocks({
            runCli: function (cliArguments, _processOptions) {
                equal(cliArguments.toString(), 'foo.js bar baz', "should pass correct arguments");
                strictEqual(_processOptions, processOptions, "should pass correct process options");
                return result;
            }
        });

        strictEqual(script.runCli(['bar', 'baz'].toCliArguments(), processOptions), result,
            "should return whatever the super returns");

        giant.CliApplication.removeMocks();
    });
}());

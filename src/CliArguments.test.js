/*global dessert, troop, sntls, giant */
/*global module, test, asyncTest, start, expect, ok, equal, notEqual, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("CliArguments");

    test("Instantiation with argv", function () {
        var args = giant.CliArguments.create(['foo', 'bar', '--baz=qux']);

        deepEqual(args.options.items, {
            baz: 'qux'
        }, "should set options collection property");
    });

    test("Instantiation without argv", function () {
        var args = giant.CliArguments.create();

        deepEqual(args.options.items, {}, "should set options collection property");
    });

    test("Conversion from array", function () {
        var args = ['foo', 'bar', '--baz=qux'].toCliArguments();

        ok(args.isA(giant.CliArguments), "should return giant.CliArguments instance");
        deepEqual(args.options.items, {
            baz: 'qux'
        }, "should set options collection property");
    });

    test("Option setter", function () {
        var args = giant.CliArguments.create();

        strictEqual(args.setOption('foo', 'bar'), args, "should be chainable");
        deepEqual(args.options.items, {
            foo: 'bar'
        }, "should set option in options buffer");
    });

    test("Adding options", function () {
        var args = giant.CliArguments.create()
            .setOption('foo', 'bar');

        strictEqual(args.addOptions(sntls.Collection.create({
            baz: 'qux'
        })), args, "should be chainable");

        deepEqual(args.options.items, {
            foo: 'bar',
            baz: 'qux'
        }, "should set options in options buffer");
    });

    test("Option getter", function () {
        var args = ['foo', 'bar', '--baz=qux'].toCliArguments();

        equal(args.getOption('baz'), 'qux', "should return value for specified option");
        equal(typeof args.getOption('foo'), 'undefined', "should return undefined for absent option");
    });

    test("Arguments getter", function () {
        var args = ['--foo=bar', '--baz=qux'].toCliArguments();

        deepEqual(args.getAsArguments(), ['--baz=qux', '--foo=bar'],
            "should re-assemble options");
    });

    test("Serialization", function () {
        var args = ['--foo=bar', '--baz=qux'].toCliArguments();

        equal(args.toString(), '--baz=qux --foo=bar', "should re-assemble options");
    });
}());

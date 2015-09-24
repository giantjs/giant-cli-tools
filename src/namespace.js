/*jshint node:true */

/** @namespace */
var giant = giant || require('giant-namespace');

/** @namespace */
var $assertion = $assertion || require('giant-assertion');

/** @namespace */
var $oop = $oop || require('giant-oop');

/** @namespace */
var $utils = $utils || require('giant-utils');

if (typeof require === 'function') {
    require('giant-data');
    require('giant-event');
}

/**
 * @function
 * @see http://documentup.com/kriskowal/q/
 */
var Q = Q || require('q', 'Q');

/**
 * Native string class.
 * @name String
 * @class
 */

/**
 * Native array class.
 * @name Array
 * @class
 */

/**
 * @name giant.Hash
 * @class
 */

/**
 * @name giant.Path
 * @class
 */

/*!
 * packit
 * Copyright(c) 2011 Michal Kuklis <michal.kuklis@gmail.com>
 * MIT Licensed
 */


/**
 * Dependecies
 */

var Compressor = require('./compressor');

/**
 * Library version.
 */

exports.version = '0.0.1';

exports.compile = function(options) {
  var comp = new Compressor(options);
  comp.compile();
}

var assert = require('assert')
  , Compressor = require('compressor');

module.exports = {
  'test .compile missing config throws exception': function() {
    var compressor = new Compressor();
    assert.throws(compressor.compile, Error); 
    assert.throws(compressor.compile, "Config is required."); 
  },

  "test constructor with config": function() {
    var options = {configPath: process.cwd() + "/test/assets/config.json"}
      , comp = new Compressor(options);
    assert.equal(options.configPath, comp.options.configPath);
  }
}

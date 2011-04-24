var assert = require('assert')
  , packit = require('packit');

module.exports = {
  'test .version': function() {
    assert.ok(/^\d+\.\d+\.\d+$/.test(packit.version), "Invalid version format");
  },

  'test .compile missing config throws exception': function(test) {
    assert.throws(packit.compile, Error); 
    assert.throws(packit.compile, "Config is required."); 
  }
}

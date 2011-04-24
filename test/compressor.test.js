var fs = require('fs')
  , assert = require('assert')
  , Compressor = require('compressor');

// default options
var options = {
  configPath: process.cwd() + "/test/assets/config.json",
  outputPath: process.cwd() + "/test/assets/templates.json"
};

module.exports = {
  'test .compile missing config throws exception': function() {
    var compressor = new Compressor();
    assert.throws(compressor.compile, Error); 
    assert.throws(compressor.compile, "Config is required."); 
  },

  "test option configPath": function() {
    var comp = new Compressor(options);
    assert.equal(options.configPath, comp.options.configPath);
  },

  "test .compile": function() {
    var comp = new Compressor(options)
      , templates = comp.compile();
    assert.equal(templates.tmp1, "<div><div>template 1test</div>test</div>");
    assert.equal(templates.subfolder.tmp3, "<div><div>template 3test</div>test</div>");
    
  }
}

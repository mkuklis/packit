var Compressor = require('../lib/compressor');

describe('compressor', function() {
  it('should throw exception', function() {
    var compressor = new Compressor();
    expect( function(){ compressor.compile(); } ).toThrow(new Error("Config is required."));
  });
});

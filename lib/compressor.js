/*!
 * packit - Compressor
 * Copyright(c) 2011 Michal Kuklis <michal.kuklis@gmail.com>
 * MIT Licensed
 */


/**
 * Dependencies.
 */
 
var fs = require('fs');

/**
 * Expose compressor.
 */

module.exports = Compressor;

/**
* Compressor constructor.
*/

function Compressor(options) {
  options = options || {};
  this.namespace = options.namespace || "templates";
  this.inputPath = options.inputPath;
  this.outputFile = options.outputPath || process.cwd() + "/templates.js";
  this.TMP_START = "var " + this.namespace + " = ";
  this.TMP_END = ";";
}

Compressor.prototype = {

  constructor: Compressor,
  
  /**
  * Compresses templates for given path.
  * @param {Array} paths  
  */

  compile: function() {
    if (!this.inputPath) throw new Error('Input path is required.');
    var templates = this.build(this.inputPath);
    var tmplFile = fs.createWriteStream(this.outputFile, {'flags': 'w'});
    tmplFile.write(this.TMP_START + JSON.stringify(templates) + this.TMP_END);
  },

  /**
  * Builds and returns JSON representation of the file system for given path
  * replacing template files with their compressed representation.
  * 
  * @param {String} path
  * @param {JSON Object} templates
  */
  
  build: function (path, templates) {
    var stat = fs.statSync(path);
    if (stat.isDirectory()) {
      var dirName = this.getDirName(path);
      if (templates) {
        templates[dirName] = {}; 
      }
      else {
        templates = {};
      }
      fs.readdirSync(path).forEach(function(f) {
        this.build(path + "/" + f, templates[dirName] || templates);
      }, this);
    }
    else {
      templates[this.getTemplateName(path)] = this.compressTmpl(path);
    }
    return templates;
  },
  
  /**
   * Compresses single template for given path.
   */
  
  compressTmpl: function(path) {
    var template = fs.readFileSync(path, 'utf8');
    return template.replace(/\r?\n/g, '');
  },

  /**
   * Returns template name for given path.
   */
  
  getTemplateName: function(path) {
    return path.split('/').pop().replace(/_|(\..+)/g, '');
  },

  /**
   * Returns dir name for given path.
   */

  getDirName: function(path) {
    return path.split('/').pop();
  }
}

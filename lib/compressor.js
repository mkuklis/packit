/*!
 * packit - Compressor
 * Copyright(c) 2011 Michal Kuklis <michal.kuklis@gmail.com>
 * MIT Licensed
 */


/**
 * Dependencies.
 */
 
var fs = require('fs')
  , _ = require('underscore')._;


/**
 * Exposes compressor.
 */

module.exports = Compressor;

/**
* Compressor constructor.
*/

function Compressor(options) {
  // default options
  this.options = {
    configPath: false,
    namespace: "JST",
    basePath: process.cwd(),
    outputPath:  process.cwd() + "/templates.js"
  };

  _.extend(this.options, options);

  this.TMP_START = "var " + this.options.namespace + " = ";
  this.TMP_END = ";";

  // set basePath
  if (this.options.configPath) {
    var chunks = this.options.configPath.split('/');
    this.options.basePath = chunks.slice(0, chunks.length - 1).join('/');
  }
}

Compressor.prototype = {

  // restore constructor
  constructor: Compressor,
  
  /**
  * Compresses templates for given path.
  * @param {Array} paths  
  */

  compile: function() {
    if (!this.options.configPath) throw new Error('config is required.');

    var config = this.loadConfig(this.options.configPath)
      , tmplFile = fs.createWriteStream(this.options.outputPath, {'flags': 'w'})
      , templates = this.buildTmpls(config.templates);
    
    tmplFile.write(this.TMP_START + JSON.stringify(templates) + this.TMP_END);
  },
  

  /**
  * Loads config for given path.
  *
  * @param {String} path
  */
  
  loadConfig: function(path) {
    return this.readJSON(path);
  },
  

  /**
   * Builds and returns templates in JSON format.
   *
   * @param {Array} tmplPaths
   */
  
  buildTmpls: function(tmplPaths) {
    return _(tmplPaths)
      .map(function(path) {
        return this.buildTmpl(path);
      }, this)
      .reduce(function(result, template) {
        _(result).extend(template);
        return result;
    });
  },


  /**
   * Compresses single template for given path.
   * 
   * @param {String} path
   */
  
  compressTmpl: function(path) {
    var template = fs.readFileSync(this.options.basePath + path, 'utf8');
    return template.replace(/(\r?\n|\s{2})/g, '');
  },


  /**
   * Returns template name for given path.
   *
   * @param {String} path
   */
  
  buildTmpl: function(path) {
    var chunks = path.split('/')
      , tmplName = chunks.pop().replace(/_|(\..+)/g, '')
      , template = {};
    
    template[tmplName] = this.compressTmpl(path);
  
    if (chunks.length <= 2) {
      return template;
    }
    else {
      var view = {};
      view[chunks.pop()] = template;
      return view;
    }
  },

  /**
   * Reads and parses file to JSON for given path.
   *
   * @param {String} path
   */
  
  readJSON: function(path) {
    try {
      return JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch (err) {
      // oops
    }
  }
}

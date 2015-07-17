/** @module Node Pom Parser */

"use strict";

var fs = require("fs");
var xml2js = require("xml2js");
var util = require('util')
var traverse = require('traverse');

/**
 * Load xml file contents using the sync mode.
 * @param {object} opt Is the options with filePath in it.
 * @return {object} The xml content with timer with load time.
 */
function _loadXmlFileContents(opt) {
  if (!opt.filePath) {
    throw new Error("You must provide the opt.filePath");
  }

  return fs.readFileSync(opt.filePath, "utf8");
};

/**
 * Removes all the arrays with single elements with a string value.
 * @param {object} o is the object to be traversed.
 */
function removeSingleArrays(obj) {
  // Traverse all the elements of the object
  traverse(obj).forEach(function traversing(value) {
    // As the XML parser returns single fields as arrays.
    if (value instanceof Array && value.length === 1) {
      this.update(value[0]);
    }
  });
}

/**
 * Extremely FAST pom header reader using node-expat c library.
 * @param {object} opt Is the option with the filePath or xmlContent and the optional format.
 * @return {object} The pom object along with the timers.
 */
module.exports.parse = function(opt, callback) {
  if (!opt) {
    throw new Error("You must provide options: opt.filePath and any other option of " +
      "https://github.com/Leonidas-from-XIV/node-xml2js#options");
  }
  if (!opt.xmlContent && !opt.filePath) {
    throw new Error("You must provide the opt.filePath or the opt.xmlContent");
  }

  // Use or load the content from the filePath
  var loadedXml = false;
  if (!opt.xmlContent) {
    opt.xmlContent = _loadXmlFileContents(opt);
    loadedXml = true;
  }

  // xmljs options https://github.com/Leonidas-from-XIV/node-xml2js#options
  //opt.attrkey = "@";
  opt.trim = true;
  opt.normalizeTags = true;
  opt.normalize = true;
  opt.mergeAttrs = true;

  // parse the pom, erasing all
  xml2js.parseString(opt.xmlContent, opt, function (err, pomObject) {
    // Depending on the requested format, format it or not.
    if (err) {
      callback(err, null);
    }

    // Replace the arrays with single elements with strings
    removeSingleArrays(pomObject);

    var response = {};
    // Only add the pomXml when loaded from the file-system.
    if (loadedXml) {
      response.pomXml = opt.xmlContent;
    }
    // Always add the object
    response.pomObject = pomObject;

    // Callback with the value
    callback(null, response);
  });

};

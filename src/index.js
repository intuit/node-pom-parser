/** @module Node Pom Parser */

"use strict";

var fs = require("fs");
var sax = require("../lib/sax_parser.js");
var expat = require("../lib/expat_parser.js");

/**
 * Load xml file contents using the sync mode.
 * @param {object} opt Is the options with filePath in it.
 * @return {object} The xml content with timer with load time.
 */
module.exports.loadXmlFileContents = function(opt) {
  if (!opt.filePath) {
    throw new Error("You must provide the opt.filePath");
  }

  var loadStart = process.hrtime();
  var pomXmlContent = fs.readFileSync(opt.filePath, "utf8");
  var loadPomTime = process.hrtime(loadStart);
  return {
    xmlContent: pomXmlContent,
    timers: {
      load: (loadPomTime[1] / 1000000) + "ms"
    }
  };
};

/**
 * Extremely FAST pom header reader using node-expat c library.
 * @param {object} opt Is the option with the filePath or xmlContent and the optional format.
 * @return {object} The pom object along with the timers.
 */
module.exports.parsePom = function(opt) {
  if (!opt) {
    throw new Error("You must provide options: opt.filePath and [opt.format=(*json|text)]");
  }
  if (!opt.xmlContent && !opt.filePath) {
    throw new Error("You must provide the opt.filePath or the opt.xmlContent");
  }
  if (!opt.format) {
    opt.format = "json";

  } else if (opt.format !== "text" && opt.format !== "json") {
    throw new Error("You must provide the opt.format = (json | text)");
  }

  // Use or load the content from the filePath
  var pom = { timers: { load: 0, parse: 0 } }
  if (!opt.xmlContent) {
    pom = this.loadXmlFileContents(opt);
  }

  var loadTimer = pom.timers;

  // parse the pom, erasing all
  var parsePomStart = process.hrtime();
  pom = sax.parse(pom.xmlContent);
  //pom = expat.parse(pom.xmlContent); // EXTREMELY FASTER, BUT BROKEN!

  pom.timers = {};
  var parsePomTime = process.hrtime(parsePomStart);
  pom.timers.parse = (parsePomTime[1] / 1000000) + "ms";

  // Update the ref to the timer
  pom.timers.load = loadTimer.load;

  // Depending on the requested format, format it or not.
  return opt.format === "json" ? pom : (pom.groupId + ":" + pom.artifactId + ":" + pom.version);
};

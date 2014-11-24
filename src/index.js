/** @module Node Pom Parser */

"use strict";

var expat = require("node-expat");
var parser = new expat.Parser("UTF-8");
var fs = require("fs");

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
  var pom = this.loadXmlFileContents(opt);

  // In case of error, just abort fast
  parser.on("error", function(error) {
    pom.err = error;
    parser.destroy();
  });

  // Parsing the elements from the pom.xml
  parser.on("startElement", function(startName, attrs) {
    if (startName === "project") {
      parser.on("startElement", function(startName, attrs) {
        // Whenever a value has been assigned, never replace it
        if (startName === "groupId") {
          parser.on("text", function(text) {
            pom.groupId = pom.groupId || text;
          });

        } else if (startName === "artifactId") {
          parser.on("text", function(text) {
            pom.artifactId = pom.artifactId || text;
          });

        } else if (startName === "version") {
          parser.on("text", function(text) {
            pom.version = pom.version || text;
            // Done here! So quit fast!
            parser.destroy();
          });
        }
      });
    }
  });

  // Compute the time to parse the xml content
  var parsePomStart = process.hrtime();
  parser.parse(pom.xmlContent);
  var parsePomTime = process.hrtime(parsePomStart);
  delete pom.xmlContent;

  pom.timers.parse = (parsePomTime[1] / 1000000) + "ms";

  // Depending on the requested format, format it or not.
  return opt.format === "json" ? pom : (pom.groupId + ":" + pom.artifactId + ":" + pom.version);
};

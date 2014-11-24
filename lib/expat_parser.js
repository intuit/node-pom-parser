/** @module Node Pom EXPAT Parser */

"use strict";

var expat = require("node-expat");
var parser = new expat.Parser("UTF-8");
var fs = require("fs");

/**
 * Extremely FAST pom header reader using node-expat c library.
 * @param {object} xmlContent Is the xml document.
 * @return {object} The pom object.
 */
module.exports.parse = function(xmlContent) {
  if (!xmlContent) {
    throw new Error("You must provide the xmlContent");
  }

  // In case of error, just abort fast
  parser.on("error", function(error) {
    pom.err = error;
    parser.destroy();
  });

  var pom = {};

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

  // Parse, blocking until it ends.
  parser.parse(xmlContent);
  return pom;
};

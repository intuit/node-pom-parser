/** @module Node Pom SAX Parser */

"use strict";

var fs = require("fs");
var ltx = require("ltx");

/**
 * Slower parser that loads some pieces of the pom.xml.
 * @param {string} xmlContent Is the option with the filePath or xmlContent and the optional format.
 * @return {object} The pom object.
 */
module.exports.parse = function(xmlContent) {
  if (!xmlContent) {
    throw new Error("You must provide the xmlContent");
  }
  // SAX parser that parses the document and keeps in memory
  var pomObject = ltx.parse(xmlContent);
  var pom = {};

  pomObject.children.forEach(function(childElement) {
    if (childElement.name && childElement.name === "groupId") {
      pom.groupId = childElement.children[0];

    } else if (childElement.name && childElement.name === "artifactId") {
      pom.artifactId = childElement.children[0];

    } else if (childElement.name && childElement.name === "version") {
      pom.version = childElement.children[0];
    }
  });

  return pom;
};

/** @module Node Pom Parser */

"use strict";

import fs from 'fs';
import xml2js from 'xml2js';
import traverse from 'traverse';

// xmljs options https://github.com/Leonidas-from-XIV/node-xml2js#options
const XML2JS_OPTS = {
  trim: true,
  normalizeTags: true,
  normalize: true,
  mergeAttrs: true
};

/**
 * Parses xml into javascript object by using a file path or an xml content.
 * @param {object} opt Is the option with the filePath or xmlContent and the optional format.
 * @return {object} The pom object along with the timers.
 */
async function parse(opt, callback) {
  if (!opt) {
    throw new Error(
      "You must provide options: opt.filePath and any other option of " +
        "https://github.com/Leonidas-from-XIV/node-xml2js#options"
    );
  }
  if (!opt.xmlContent && !opt.filePath) {
    throw new Error("You must provide the opt.filePath or the opt.xmlContent");
  }

  // If the xml content is was not provided by the api client.
  // https://github.com/petkaantonov/bluebird/blob/master/API.md#error-rejectedhandler----promise
  if (!opt.xmlContent) {
    try {
      const xmlContent = await readFileAsync(opt.filePath, "utf8");
      const result = await _parseWithXml2js(xmlContent);
      callback(null, result);
    } catch (e) {
      callback(e, null);
    }
  } else {
    // parse the xml provided by the api client.
    try {
      const result = await _parseWithXml2js(opt.xmlContent);
      delete result.xmlContent;
      callback(null, result);
    } catch (e) {
      callback(e);
    }
  }
};

/**
 * Parses the given xml content.
 * @param xmlContent {string} Is the xml content in string using utf-8 format.
 * @param loadedXml {boolean} Whether the xml was loaded from the file-system.
 * @param callback {function} The callback function using Javascript PCS.
 */
async function _parseWithXml2js(xmlContent) {
  // parse the pom, erasing all
  const pomObject = await xml2js.parseStringPromise(xmlContent, XML2JS_OPTS);

  // Replace the arrays with single elements with strings
  removeSingleArrays(pomObject);

  // Response to the call
  return {
    pomXml: xmlContent, // Only add the pomXml when loaded from the file-system.
    pomObject: pomObject, // Always add the object
  };
}

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

async function readFileAsync(path, encoding) {
  return await fs.promises.readFile(path, { encoding });
}

export default parse;

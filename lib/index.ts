/** @module Node Pom Parser */

"use strict";

import fs from 'fs';
import xml2js, { Options } from 'xml2js';
import traverse from 'traverse';

// xmljs options https://github.com/Leonidas-from-XIV/node-xml2js#options
var XML2JS_OPTS = {
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
function parse(
  opt: (Options & { filePath?: string; xmlContent?: string }) | null,
  callback: (
    e: Error | null,
    r?: {
      pomXml: string;
      pomObject: object;
    } | null
  ) => void
) {
  if (!opt) {
    throw new Error("You must provide options: opt.filePath and any other option of " +
      "https://github.com/Leonidas-from-XIV/node-xml2js#options");
  }
  if (!opt.xmlContent && !opt.filePath) {
    throw new Error("You must provide the opt.filePath or the opt.xmlContent");
  }


  // If the xml content is was not provided by the api client.
  // https://github.com/petkaantonov/bluebird/blob/master/API.md#error-rejectedhandler----promise
  if (opt.filePath) {
    readFileAsync(opt.filePath, "utf8").then(function(xmlContent) {
        return xmlContent;

      })
      .then(_parseWithXml2js).then(function (result) {
        callback(null, result);

      }).catch(function (e) {
        callback(e, null);
      });

  } else if (opt.xmlContent) {
    // parse the xml provided by the api client.
     _parseWithXml2js(opt.xmlContent).then(function(result) {
      callback(null, result);

    }).catch(function (e) {
      callback(e);
    });
  }

};

/**
 * Parses the given xml content.
 * @param xmlContent {string} Is the xml content in string using utf-8 format.
 * @param loadedXml {boolean} Whether the xml was loaded from the file-system.
 * @param callback {function} The callback function using Javascript PCS.
 */
function _parseWithXml2js(xmlContent: string): Promise<{
  pomXml: string;
  pomObject: object;
}> {
  return new Promise(function (resolve, reject) {
    // parse the pom, erasing all
    xml2js.parseString(xmlContent, XML2JS_OPTS, function(err, pomObject) {
      if (err) {
        // Reject with the error
        reject(err);
      }

      // Replace the arrays with single elements with strings
      removeSingleArrays(pomObject);

      // Response to the call
      resolve({
        pomXml: xmlContent, // Only add the pomXml when loaded from the file-system.
        pomObject: pomObject, // Always add the object
      });
    });
  });
}

/**
 * Removes all the arrays with single elements with a string value.
 * @param {object} o is the object to be traversed.
 */
function removeSingleArrays(obj: Object) {
  // Traverse all the elements of the object
  traverse(obj).forEach(function traversing(value) {
    // As the XML parser returns single fields as arrays.
    if (value instanceof Array && value.length === 1) {
      this.update(value[0]);
    }
  });
}

function readFileAsync(
  path: string,
  encoding: BufferEncoding | undefined
): Promise<string> {
  return new Promise((resolve, reject) =>
    fs.readFile(path, { encoding }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        data instanceof Buffer
          ? resolve(data.toString(encoding))
          : resolve(data);
      }
    })
  );
}

export default parse;
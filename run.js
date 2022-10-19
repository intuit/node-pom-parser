import parse from './lib/index.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

//var pomParser = require("./lib/index");
// The required options, including the filePath.
// Other parsing options from https://github.com/Leonidas-from-XIV/node-xml2js#options

const __dirname = dirname(fileURLToPath(import.meta.url));

var opts = {
  filePath: __dirname + "/test/fixture/pom.xml", // The path to a pom file
};
// Parse the pom based on a path
parse(opts, function(err, pomResponse) {
  if (err) {
    console.log("ERROR: " + err);
    process.exit(1);
  }

  // The original pom xml that was loaded is provided.
  console.log("XML: " + pomResponse.pomXml);
  // The parsed pom pbject.
  console.log("OBJECT: " + JSON.stringify(pomResponse.pomObject));
});
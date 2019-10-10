var pomParser = require("../lib");
var assert = require('assert');

var POM_PATH = __dirname + "/fixture/pom3.xml";

describe('require("pom-parser")', function () {

  describe('loading invalid files', function() {
    /**
     * Per the xml spec (https://www.w3.org/TR/REC-xml/#sec-comments):
     * "For compatibility, the string ' -- ' (double-hyphen) must not occur within comments"
     * 
     * The pom parser should return with an error response detailing why it failed. The parse() function does not return a promise 
     * but rather a callback with error and response parameters. 
     */
    it('gracefully fails to parse invalid xml', function(done) {
      pomParser.parse({filePath: POM_PATH}, function(err, response) {
        assert(err.message.startsWith("Malformed comment"), "Invalid xml (with -- inside a comment) should return an error with 'Malformed comment'");
	      done();
      });
    });
  });
});

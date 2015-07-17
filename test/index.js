var pomParser = require("../lib");
var expect = require('chai').expect

var POM_PATH = __dirname + "/fixture/pom.xml";

describe('require("pom-parser")', function () {

  describe('loading from files', function() {
    var pomResponse = null;
    var pom = null;
    var xml = null;

    before(function() {
      pomParser.parse({filePath: POM_PATH}, function(err, response) {
        expect(err).to.be.null;
        expect(response).to.be.an("object");

	pomResponse = response;
	pom = pomResponse.pomObject;
        xml = pomResponse.pomXml;
      });
 
    });

   after(function() {
     console.log("\n\nThe XML loaded");
     console.log(xml);
     console.log("\n\nThe parsed XML");
     console.log(JSON.stringify(pom, null, 2));
   });

    it('can load any pom.xml properly', function () {
      expect(pomResponse.pomXml).to.be.an("string");
      expect(pomResponse.pomObject).to.be.an("object");
    });

    it('parses xml attributes as properties', function () {
      expect(pom.project.xmlns).to.equal("http://maven.apache.org/POM/4.0.0");
      expect(pom.project["xmlns:xsi"]).to.equal("http://www.w3.org/2001/XMLSchema-instance"); 
    });

    it('parses xml elements as properties', function () {
      expect(pom.project.parent).to.be.an("object");
      expect(pom.project.parent.artifactid).to.equal("tynamo-parent");
    });

  });
});

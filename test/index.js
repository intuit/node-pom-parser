import parse from '../lib/index.js';
import {expect} from 'chai';
import assert from 'assert';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const POM_PATH = __dirname + "/fixture/pom.xml";

describe('require("pom-parser")', function () {
  describe('loading from files', function () {
    let pomResponse = null;
    let pom = null;
    let xml = null;

    // Setup the tests using mocha's promise.
    // https://lostechies.com/derickbailey/2012/08/17/asynchronous-unit-tests-with-mocha-promises-and-winjs/
    before(function(done) {
      parse({filePath: POM_PATH}, function(err, response) {
        expect(err).to.be.null;
        expect(response).to.be.an("object");
        
        pomResponse = response;
        pom = pomResponse.pomObject;
        xml = pomResponse.pomXml;
        done();
      });
    });

    // Tear down the tests by printing the loaded xml and the parsed object.
    after(function(done) {
      console.log("\n\nThe XML loaded");
      console.log(xml);
      console.log("\n\nThe parsed XML");
      console.log(JSON.stringify(pom, null, 2));
      done();
    });

    it('can load any pom.xml properly', function(done) {
      expect(pomResponse.pomXml).to.be.an("string");
      expect(pomResponse.pomObject).to.be.an("object");
      done();
    });

    it('parses xml attributes as properties', function(done) {
      expect(pom.project.xmlns).to.equal("http://maven.apache.org/POM/4.0.0");
      expect(pom.project["xmlns:xsi"]).to.equal(
        "http://www.w3.org/2001/XMLSchema-instance"
      );
      done();
    });

    it('parses xml elements as properties', function(done) {
      expect(pom.project.parent).to.be.an("object");
      expect(pom.project.parent.artifactid).to.equal("tynamo-parent");
      done();
    });
  });

  describe('when opts is null', function () {
    it('parser should throw an error', async function () {
      try {
        await pomParser.parse(null, (err, result) => {});
      } catch (e) {
        expect(e).to.not.be.undefined;
      }
    });
  });

  describe('when opts is empty', function () {
    it('parser should throw an error', async function () {
      try {
        pomParser.parse({}, (err, result) => {});
      } catch (e) {
        expect(e).to.not.be.undefined;
      }
    });
  });

  describe('error scenarios', function() {
    it('should return error if file does not exist', function(done) {
      parse({ filePath: __dirname + 'incorrect-file-path' }, function(err, response) {
        expect(response).to.be.null;
        expect(err).to.not.be.null;
        done();
      });
    });

    it('should return error if invalid xml file', function(done) {
      parse({ filePath: __dirname + '/fixture/pom2.xml' }, function(err, response) {
        expect(response).to.be.null;
        expect(err).to.not.be.null;
        done();
      });
    });

    it('should return error if invalid xml content', function(done) {
      const invalidXml = '<parent>this is invalid</PARENT>';
      parse({ xmlContent: invalidXml }, function(err) {
        expect(err).to.not.be.null;
        done();
      });
    });
  });
  
});

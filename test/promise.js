var pomParser = require("../lib");
var expect = require('chai').expect;
var assert = require('assert');

var POM_PATH = __dirname + "/fixture/pom.xml";
var POM_PATH_BAD = __dirname + "/fixture/pom_badpath.xml";

describe('parse.then - resolve on valid input', function() {
  var pomResponse = null;
  var pom = null;
  var xml = null;
  var parseErr = null;

  before(function(done) {
    pomParser.parse({filePath: POM_PATH})
      .then(function(response) {
        pomResponse = response;
        pom = pomResponse.pomObject;
        xml = pomResponse.pomXml;
      }, function(err) {
        parseErr = err;
      })
      .finally(function() {
          expect(parseErr).to.be.null;
          expect(pomResponse).to.be.an("object");
          done();
      });
  });

  it('resolves promise on good pom & path', function(done) {
    expect(pomResponse.pomXml).to.be.an("string");
    expect(pomResponse.pomObject).to.be.an("object");
    done();
  });
});

describe('parse.then - reject on bad input', function() {
  var pomResponse = null;
  var pom = null;
  var xml = null;
  var parseErr = null;

  before(function(done) {
    pomParser.parse({filePath: POM_PATH_BAD})
      .then(function(response) {
        pomResponse = response;
        pom = pomResponse.pomObject;
        xml = pomResponse.pomXml;
      }, function(err) {
        parseErr = err;
      })
      .finally(function() {
        expect(parseErr).to.be.Error;
        expect(pomResponse).to.be.null;
        done();
      });
  });

  it('rejects promise on invalid path', function(done) {
    done();
  });
});


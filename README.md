# Node.js pom.xml Parser

[![CI Build Status](https://github.com/intuit/node-pom-parser/actions/workflows/unit-tests.yml/badge.svg?branch=master)](https://github.com/intuit/node-pom-parser/actions/workflows/unit-tests.yml)
![npm](https://img.shields.io/npm/v/node-pom-parser)
[![CodeQL Analysis](https://github.com/intuit/node-pom-parser/actions/workflows/codeql.yml/badge.svg?branch=master)](https://github.com/intuit/node-pom-parser/actions/workflows/codeql.yml)
[![Coverage Status](https://coveralls.io/repos/intuit/node-pom-parser/badge.svg?branch=master&service=github)](https://coveralls.io/github/intuit/node-pom-parser?branch=master) 
![License](https://img.shields.io/github/license/intuit/node-pom-parser)

Parsing Java's pom.xml and properly returning the json object, including attributes and values.

[![NPM](https://nodei.co/npm/pom-parser.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/pom-parser/)

# Motivation

* Your enterprise decided to move production code written in Java to Node.js
* Your enterprise uses a centralized Nexus repository where your Java project uses pom.xml to manage app packaging.
* Your enterprise still plans to use Nexus repository to package Node.js applications.
* Your enterprise engineers want an API to retrieve information from the pom.xml file from those Node.js apps.

# Features

* Reads any pom.xml.
* All xml elements are placed into properties.
* All xml element attributes are merged into the parent element.
* Both the xml string and the parsed object are returned.
* You can provide parsing options.

# Installation

```sh
$ npm install --save node-pom-parser
$ yarn add node-pom-parser
```

# Use

* Printing the object

```js
var pomParser = require("pom-parser");
// The required options, including the filePath.
// Other parsing options from https://github.com/Leonidas-from-XIV/node-xml2js#options
var opts = {
  filePath: __dirname + "/pom.xml", // The path to a pom file
};
// Parse the pom based on a path
pomParser.parse(opts, function(err, pomResponse) {
  if (err) {
    console.log("ERROR: " + err);
    process.exit(1);
  }

  // The original pom xml that was loaded is provided.
  console.log("XML: " + pomResponse.pomXml);
  // The parsed pom pbject.
  console.log("OBJECT: " + JSON.stringify(pomResponse.pomObject));
});
```
It should print the follow object with the following properties:

* '_' represents the text value of an element with attributes and text values.

```js
{
  "project": {
    "xmlns": "http://maven.apache.org/POM/4.0.0",
    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "xsi:schemaLocation": "http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd",
    "parent": {
      "artifactid": "tynamo-parent",
      "groupid": "org.tynamo",
      "version": "0.0.9"
    },
    "modelversion": {
      "_": "4.0.0",
      "parallel": "now"
    },
    "groupid": "org.tynamo.examples",
    "artifactid": "tynamo-example-federatedaccounts",
    "version": "0.0.1-SNAPSHOT",
    "packaging": "war",
    "name": "Tynamo Example - Federated Accounts",
    "properties": {
      "tapestry-release-version": "5.3.1",
      "gae.version": "1.3.0",
      "gae.home": "${settings.localRepository}/com/google/appengine/appengine-api-1.0-sdk/${gae.version}/appengine-java-sdk-${gae.version}",
      "gae.application.version": "0"
    },
    "build": {
      "finalname": "federatedaccounts",
      "resources": {
        "resource": [
          {
            "directory": "src/main/resources"
          },
          {
            "directory": "src/main/filtered-resources",
            "filtering": "true"
          }
        ]
      },
      "plugins": {
        "plugin": [
          {
            "groupid": "org.apache.maven.plugins",
            "artifactid": "maven-compiler-plugin",
            "configuration": {
              "source": "1.6",
              "target": "1.6",
              "optimize": "true"
            }
          },
          {
            "groupid": "net.kindleit",
            "artifactid": "maven-gae-plugin",
            "version": "0.8.0",
            "configuration": {
              "serverid": "tynamo-example-federatedaccounts"
            }
          },
          {
            "groupid": "org.apache.maven.plugins",
            "artifactid": "maven-war-plugin",
            "configuration": {
              "webresources": {
                "resource": {
                  "directory": "src/main/webapp",
                  "filtering": "true",
                  "includes": {
                    "include": "**/appengine-web.xml"
                  }
                }
              }
            }
          }
        ]
      }
    },
    "reporting": {
      "plugins": {
        "plugin": {
          "groupid": "org.apache.tapestry",
          "artifactid": "tapestry-component-report",
          "version": "${tapestry-release-version}",
          "configuration": {
            "rootpackage": "org.tynamo"
          }
        }
      }
    },
    "dependencies": {
      "dependency": [
        {
          "groupid": "com.google.appengine",
          "artifactid": "appengine-api-1.0-sdk",
          "version": "${gae.version}"
        },
        {
          "groupid": "com.h2database",
          "artifactid": "h2"
        },
        {
          "groupid": "org.apache.tapestry",
          "artifactid": "tapestry-core",
          "version": "${tapestry-release-version}"
        },
        {
          "groupid": "javax.servlet",
          "artifactid": "servlet-api",
          "version": "2.5",
          "type": "jar",
          "scope": "provided"
        }
      ]
    },
    "profiles": {
      "profile": {
        "id": "repositories",
        "repositories": {
          "repository": {
            "id": "maven-gae-plugin-repo",
            "name": "maven-gae-plugin repository",
            "url": "http://maven-gae-plugin.googlecode.com/svn/repository"
          }
        },
        "pluginrepositories": {
          "pluginrepository": {
            "id": "maven-gae-plugin-repo",
            "name": "maven-gae-plugin repository",
            "url": "http://maven-gae-plugin.googlecode.com/svn/repository"
          }
        }
      }
    }
  }
}
```

# License

`node-pom-parser` is provided under the MIT license.

Contributing
=======

Pull requests are welcome!

* Please send PRs to the `develop` branch for the next release!
* Make sure to watch all the Github Actions status are passing!

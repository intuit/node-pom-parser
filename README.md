Node.js pom.xml Parser
=======

[![Build Status](https://travis-ci.org/marcellodesales/node-pom-parser.svg)](https://travis-ci.org/marcellodesales/node-pom-parser) [![License](https://img.shields.io/badge/license-MIT-lightgray.svg)]

Parsing Java's pom.xml and properly returning the json object, including attributes and values.

Installation
======

```
npm install --save pom-parser
```
Features
======

* Reads any pom.xml.
* Cleans up single-element arrays into string objects.

Use
=====

* Printing the object

```js
var pom = ext.parsePom({ filePath: __dirname + "/pom.xml"});

console.log(pom);
```

It should print the follow object with the following properties:

* '$' represents the groups of attributes within the tag (outer object).

```js
{ project: 
   { '$': 
      { xmlns: 'http://maven.apache.org/POM/4.0.0',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:schemaLocation': 'http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd' },
     parent: 
      { artifactId: 'tynamo-parent',
        groupId: 'org.tynamo',
        version: '0.0.9' },
     modelVersion: { _: '4.0.0', '$': [Object] },
     groupId: 'org.tynamo.examples',
     artifactId: 'tynamo-example-federatedaccounts',
     version: '0.0.1-SNAPSHOT',
     packaging: 'war',
     name: 'Tynamo Example - Federated Accounts',
     properties: 
      { 'tapestry-release-version': '5.3.1',
        'gae.version': '1.3.0',
        'gae.home': '${settings.localRepository}/com/google/appengine/appengine-api-1.0-sdk/${gae.version}/appengine-java-sdk-${gae.version}',
        'gae.application.version': '0' },
     build: 
      { finalName: 'federatedaccounts',
        resources: [Object],
        plugins: [Object] },
     reporting: { plugins: [Object] },
     dependencies: { dependency: [Object] },
     profiles: { profile: [Object] } } }
```

License
==========

`node-pom-parser` is provided under the MIT license.

Contributing
=======

Pull requests are welcome!

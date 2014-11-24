Node.js pom.xml Parser
=======

[![Build Status](https://travis-ci.org/marcellodesales/node-pom-parser.svg?branch=0.1.0)](https://travis-ci.org/marcellodesales/node-pom-parser)

Parsing Java's pom.xml with an extremely fast XML EXPAT parser.

Installation
======

```
npm install --save node-pom-parser
```
Features
======

0.1.0: Just reads the groupId, artifactId and version.

Use
=====

* Printing the object

```
var pom = ext.parsePom({ filePath: __dirname + "/pom.xml"});

console.log(pom);
```

It should print the object:

```
{ timers: { load: '0.056185ms', parse: '0.505887ms' },
  artifactId: 'tynamo-parent',
  groupId: 'org.tynamo',
  version: '0.0.9' }

```

* Printing the string value

```
var pom2 = ext.parsePom({ filePath: __dirname + "/pom.xml", format: "text"});
console.log(pom2);
```

It should print the string format

```
org.tynamo:tynamo-parent:0.0.9
```

Contributing
-------------

Pull requests are welcome!

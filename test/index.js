var ext = require("../src");

var pom = ext.parsePom({ filePath: __dirname + "/pom.xml"});

console.log(pom);

var pom2 = ext.parsePom({ filePath: __dirname + "/pom2.xml", format: "text"});

console.log(pom2);

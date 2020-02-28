var canvasObject = require("./Unit/canvasObjectTest.js");
var canvasTest = require("./Unit/canvasTest.js");

var sumErrors = 0;

sumErrors += canvasObject.runTests();
sumErrors += canvasTest.runTests();

console.log("All Unit Tests Run, Total Errors: " + sumErrors);
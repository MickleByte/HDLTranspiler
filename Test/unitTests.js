import CanvasTest from './Unit/canvasTest.js';
import CanvasObjectTest from './Unit/canvasObjectTest.js';
import TransformerTest from './Unit/transformerTest.js';
import { myCanv } from '../index.js';
import AndGateTest from './Unit/AndGateTest.js';

var testCanvas = new CanvasTest(myCanv);
var testCanvasObject = new CanvasObjectTest();
var testTransformer = new TransformerTest();
var testAND = new AndGateTest();

var sumErrors = 0;

sumErrors += testCanvas.runTests();
sumErrors += testCanvasObject.runTests();
sumErrors += testTransformer.runTests();
sumErrors += testAND.runTests();

console.log("All Unit Tests Run, Total Errors: " + sumErrors);
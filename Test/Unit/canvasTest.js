import XOR from '../../src/XorGate.js';
import OR from '../../src/OrGate.js';
import AND from '../../src/AndGate.js';
import NOT from '../../src/NotGate.js';
import Source from '../../src/source.js';
import Indicator from '../../src/indicator.js';

export default class CanvasTest{
    constructor(canvObj){
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.testObject = canvObj;
    }

    runTests() {

        var errors = [];
        var errorCount = 0;
        var testCount = 0;
    
// tests

    // constructor tests
        testCount++;
        if (this.testObject.ctx == undefined){
            errors.push(testCount + ": ctx was not properly passed to canvas")
            errorCount++;
        }

        testCount++;
        if (this.testObject.elements.length != 0){
            errors.push(testCount + ": elements[] was not defined as an empty array")
            errorCount++;
        }

        testCount++;
        if (this.testObject.width != this.windowWidth){
            errors.push(testCount + ": canvas width is not correct")
            errorCount++;
        }

        testCount++;
        if (this.testObject.height != this.windowHeight - 60){
            errors.push(testCount + ": canvas height is not correct")
            errorCount++;
        }

        testCount++;
        if (this.testObject.scaleFactor != this.testObject.width / 25){
            errors.push(testCount + ": canvas scale factor is incorrect")
            errorCount++;
        }
       
        testCount++;
        if (this.testObject.mouseIsDown != false){
            errors.push(testCount + ": mouseIsDown incorrectly initialised")
            errorCount++;
        }

        testCount++;
        if (this.testObject.drawingLine != false){
            errors.push(testCount + ": drawingLine incorrectly initialised")
            errorCount++;
        }

        testCount++;
        if (this.testObject.deleteLineFlag != false){
            errors.push(testCount + ": deleteLineFlag incorrectly initialised")
            errorCount++;
        }

        testCount++;
        if (this.testObject.currentNumberOfInputs != 0){
            errors.push(testCount + ": currentNumberOfInputs incorrectly initialised")
            errorCount++;
        }

        testCount++;
        if (this.testObject.currentNumberOfOutputs != 0){
            errors.push(testCount + ": currentNumberOfInputs incorrectly initialised")
            errorCount++;
        }

        testCount++;
        if (this.testObject.menu == undefined){
            errors.push(testCount + ": menu incorrectly initialised")
            errorCount++;
        }

        testCount++;
        if (this.testObject.bin == undefined){
            errors.push(testCount + ": bin incorrectly initialised")
            errorCount++;
        }

    // test generateInputName()
        testCount++;
        var returnValue = this.testObject.generateInputName(0);
        if (returnValue != "A"){
            errors.push(testCount + ": generateInputName() failed where id = 0")
            errorCount++;
        }

        testCount++;
        var returnValue = this.testObject.generateInputName(6);
        if (returnValue != "G"){
            errors.push(testCount + ": generateInputName() failed where id = 6")
            errorCount++;
        }

        testCount++;
        var returnValue = this.testObject.generateInputName(7);
        if (returnValue != "AA"){
            errors.push(testCount + ": generateInputName() failed where id = 7")
            errorCount++;
        }

        testCount++;
        var returnValue = this.testObject.generateInputName(14);
        if (returnValue != "BA"){
            errors.push(testCount + ": generateInputName() failed where id = 14")
            errorCount++;
        }

        testCount++;
        var returnValue = this.testObject.generateInputName(55);
        if (returnValue != "GG"){
            errors.push(testCount + ": generateInputName() failed where id = 55")
            errorCount++;
        }


    // test generateOutputName
        testCount++;
        var returnValue = this.testObject.generateOutputName(0);
        if (returnValue != "W"){
            errors.push(testCount + ": generateOutputName() failed where id = 0")
            errorCount++;
        }

        testCount++;
        var returnValue = this.testObject.generateOutputName(4);
        if (returnValue != "WW"){
            errors.push(testCount + ": generateOutputName() failed where id = 4")
            errorCount++;
        }

        testCount++;
        var returnValue = this.testObject.generateOutputName(14);
        if (returnValue != "YY"){
            errors.push(testCount + ": generateOutputName() failed where id = 14")
            errorCount++;
        }

        testCount++;
        var returnValue = this.testObject.generateOutputName(19);
        if (returnValue != "ZZ"){
            errors.push(testCount + ": generateOutputName() failed where id = 20")
            errorCount++;
        }

    // test clear()
        this.testObject.clear();
        var sum = 0;
        var imgData = this.testObject.ctx.getImageData(0, 0, this.testObject.width, this.testObject.height);
        var red = imgData.data[0];
        var green = imgData.data[1];
        var blue = imgData.data[2];
        var alpha = imgData.data[3];
        testCount++;
        if (red != 0 && green != 0 && blue != 0 && alpha != 0){
            errors.push(testCount + ": canvas.clear() failed to clear whole canvas")
            errorCount++;
        }

    // test isOperator(node)
        testCount++;
        var testNode = new AND(0, 0, 0);
        returnValue = this.testObject.isOperator(testNode);
        if (returnValue != true){
            errors.push(testCount + ": isOperator() failed to identify an AND gate")
            errorCount++;
        }

        testCount++;
        var testNode = new OR(0, 0, 0);
        returnValue = this.testObject.isOperator(testNode);
        if (returnValue != true){
            errors.push(testCount + ": isOperator() failed to identify an OR gate")
            errorCount++;
        }

        testCount++;
        var testNode = new XOR(0, 0, 0);
        returnValue = this.testObject.isOperator(testNode);
        if (returnValue != true){
            errors.push(testCount + ": isOperator() failed to identify an XOR gate")
            errorCount++;
        }

        testCount++;
        var testNode = new NOT(0, 0, 0);
        returnValue = this.testObject.isOperator(testNode);
        if (returnValue != true){
            errors.push(testCount + ": isOperator() failed to identify a NOT gate")
            errorCount++;
        }

        testCount++;
        var testNode = new Source(0, 0, 0);
        returnValue = this.testObject.isOperator(testNode);
        if (returnValue == true){
            errors.push(testCount + ": isOperator() identified a Source as an operator")
            errorCount++;
        }

        testCount++;
        var testNode = new Indicator(0, 0, 0);
        returnValue = this.testObject.isOperator(testNode);
        if (returnValue == true){
            errors.push(testCount + ": isOperator() identified an Indicator as an operator")
            errorCount++;
        }

    // test simulate()
        testCount++;
        this.testObject.elements = [];
        var prevValue = this.testObject.simulationToggle;
        this.testObject.simulate();
        if (prevValue == this.testObject.simulationToggle){
            errors.push(testCount + ": simulate() did not invert simulationToggle flag")
            errorCount++;
        }

    // test deleteLineBtn()
        testCount++;
        var prevValue = this.testObject.deleteLineFlag;
        this.testObject.deleteLineBtn();
        if (prevValue == this.testObject.deleteLineFlag){
            errors.push(testCount + ": deleteLineBtn() did not invert deleteLineFlag")
            errorCount++;
        }
    
    // test drawLine()
        testCount++;
        this.testObject.clear();
        this.testObject.drawLine(0, 0, 50, 50);
        var imgData = this.testObject.ctx.getImageData(0, 0, this.testObject.width, this.testObject.height);
        var red = imgData.data[0];
        var green = imgData.data[1];
        var blue = imgData.data[2];
        var alpha = imgData.data[3];
        if (red == 0 && green == 0 && blue == 0 && alpha == 0){
            errors.push(testCount + ": canvas.drawLine() drew nothing on the canvas")
            errorCount++;
        }

// output of tests
        if (errorCount != 0){
            console.log(errorCount + "/" + testCount + " Tests failed in Canvas unit tests:")
            errors.forEach(element => console.log("\t" + element));
            console.log("\n");
        }
        else{
            console.log(testCount + "/" + testCount + " Canvas unit tests ran without error")
        }
    
        return errorCount;
    }

}
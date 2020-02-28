import Transformer from '../../src/transformer.js'

export default class TransformerTest{
    constructor(){
        this.testObject = new Transformer(150, 300, 50);
    }
    runTests(){
        var errors = [];
        var errorCount = 0;
        var testCount = 0;
    
// tests

    // test constructor
        testCount++;
        if (this.testObject.xPos != 150){
            errors.push(testCount + ": Incorrect xPosition")
            errorCount++;
        }
        testCount++;
        if (this.testObject.yPos != 300){
            errors.push(testCount + ": Incorrect yPosition")
            errorCount++;
        }

        testCount++;
        if (this.testObject.width != 50){
            errors.push(testCount + ": Incorrect width defined")
            errorCount++;
        }

        testCount++;
        if (this.testObject.height != 50){
            errors.push(testCount + ": Incorrect height defined, should be same as width")
            errorCount++;
        }

        testCount++;
        if (this.testObject.inputs.length != 2){
            errors.push(testCount + ": number of inputs should be 2 as default")
            errorCount++;
        }

        testCount++;
        if (this.testObject.outputs.length != 1){
            errors.push(testCount + ": number of outputs should be 1 as default")
            errorCount++;
        }

        var testTransformerInputs = new Transformer(0, 0, 10, 5, 0);
        testCount++;
        if (testTransformerInputs.outputs.length != 0){
            errors.push(testCount + ": number of outputs incorrect")
            errorCount++;
        }

        testCount++;
        if (testTransformerInputs.inputs.length != 5){
            errors.push(testCount + ": number of inputs incorrect")
            errorCount++;
        }

    // test calcIoPositions()
        testCount++;
        var returnValue = this.testObject.calcIoPosition(0, true, 1)
        if (returnValue != [this.testObject.xPos - (50 / 10), this.testObject.yPos + (0.5 * this.testObject.height)]){
            errors.push(testCount + ": posistion of input incorrect, should be in center of transformers left side when there is only 1 input")
            errorCount++;
        }
       
// output of tests
        if (errorCount != 0){
            console.log(errorCount + "/" + testCount + " Tests failed in transformer unit tests:")
            errors.forEach(element => console.log("\t" + element));
            console.log("\n");
        }
        else{
            console.log(testCount + "/" + testCount + " transformer unit tests ran without error")
        }
    
        return errorCount;
    }
}
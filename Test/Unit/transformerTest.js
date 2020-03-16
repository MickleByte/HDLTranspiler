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


        // test measures and maxX and Ys
        testCount++;
        if (this.testObject.measure != 5){
            errors.push(testCount + ": Transformer measure is incorrect, should be width / 10")
            errorCount++;
        }

        testCount++;
        if (this.testObject.maxBodyX != 185){
            errors.push(testCount + ": maxBodyX is incorrect, should be width + (7 * measure)")
            errorCount++;
        }

    // test I/O setup for different numbers of inputs and outputs

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
        if (returnValue[0] != this.testObject.minBodyX - (1.5 * this.testObject.measure)){
            errors.push(testCount + ": x posistion of input incorrect, should be minBodyX - 1.5 * measure")
            errorCount++;
        }

        testCount++;
        if (returnValue[1] != this.testObject.minBodyY + 10){
            errors.push(testCount + ": y posistion of input incorrect")
            errorCount++;
        }


        // test checkClick()
        testCount++;
        // the testObject has x = 150, y = 300 and width = 50, so gateBody = 5
        if (this.testObject.checkClick(0, 0) == true){
            errors.push(testCount + ": checkClick() failed in a case where x and y click were both less than the gate's x and y")
            errorCount++;
        }

        testCount++;
        if (this.testObject.checkClick(125, 325) == true){
            errors.push(testCount + ": checkClick() failed in a case where x click was less than the gate's x")
            errorCount++;
        }

        testCount++;
        if (this.testObject.checkClick(250, 325) == true){
            errors.push(testCount + ": checkClick() failed in a case where x click was greater than the gate's x + width")
            errorCount++;
        }

        testCount++;
        if (this.testObject.checkClick(175, 200) == true){
            errors.push(testCount + ": checkClick() failed in a case where y click was less than the gate's y + height")
            errorCount++;
        }

        testCount++;
        if (this.testObject.checkClick(175, 376) == true){
            errors.push(testCount + ": checkClick() failed in a case where y click was greater than the gate's y + height")
            errorCount++;
        }

        testCount++;
        if (this.testObject.checkClick(175, 325) == false){
            errors.push(testCount + ": checkClick() failed in a case where x and y were within the gate body")
            errorCount++;
        }

    // test translate()
    // starting x and y for test object are = (150, 300)
        testCount++;
        this.testObject.translate(5, 0)
        if (this.testObject.xPos == 155){
            errors.push(testCount + ": translate() failed in a case of positve changeX")
            errorCount++;
        }

        testCount++;
        this.testObject.translate(-5, 0)
        if (this.testObject.xPos == 150){
            errors.push(testCount + ": translate() failed in a case of negative changeX")
            errorCount++;
        }

        testCount++;
        this.testObject.translate(0, 5)
        if (this.testObject.yPos == 305){
            errors.push(testCount + ": translate() failed in a case of positive changeY")
            errorCount++;
        }

        testCount++;
        this.testObject.translate(0, -5)
        if (this.testObject.yPos == 300){
            errors.push(testCount + ": translate() failed in a case of negative changeY")
            errorCount++;
        }
    
    // test updatePosition()

        testCount++;
        this.testObject.updatePosition(500, 200)
        if (this.testObject.xPos != 500 && this.testObject.yPos != 200){
            errors.push(testCount + ": updatePosition() failed")
            errorCount++;
        }

        testCount++;
        this.testObject.updatePosition(-100, -100)
        if (this.testObject.xPos != -100 && this.testObject.yPos != -100){
            errors.push(testCount + ": updatePosition() failed where newX and newY are negative")
            errorCount++;
        }

        testCount++;
        this.testObject.updatePosition(150, 300)
        if (this.testObject.xPos != 150 && this.testObject.yPos != 300){
            errors.push(testCount + ": updatePosition() failed")
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
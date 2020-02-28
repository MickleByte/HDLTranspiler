import canvasObject from '../../src/canvasObject.js';

export default class CanvasTest{
    constructor(){
        this.testObject = new canvasObject(0,0,100,100);
    }

    runTests() {
        var errors = [];
        var errorCount = 0;
        var testCount = 0;
    
        // tests
        testCount++;
        if (this.testObject.xPos != 0){
            errors.push(testCount + ": canvasObject xPosition was not assigned correct value in canvasObject constructer")
            errorCount++;
        }
    
        testCount++;
        if (this.testObject.yPos != 0){
            errors.push(testCount + ": canvasObject yPosition was not assigned correct value in canvasObject constructer")
            errorCount++;
        }
    
        testCount++;
        if (this.testObject.width != 100){
            errors.push(testCount + ": canvasObject width was not assigned correct value in canvasObject constructer")
            errorCount++;
        }
    
        testCount++;
        if (this.testObject.height != 100){
            errors.push( testCount + ": canvasObject height was not assigned correct value in canvasObject constructer")
            errorCount++;
        }
    
        testCount++;
        if (this.testObject.checkClick(50,50) != true){
            errors.push( testCount + ": checkClick returned false, despite an accurate click");
            errorCount++;
        }
    
        testCount++;
        if (this.testObject.checkClick(-1,50) != false){
            errors.push( testCount + ": checkClick returned true, despite an x < minimum bound");
            errorCount++;
        }
    
        testCount++;
        if (this.testObject.checkClick(50,-1) != false){
            errors.push( testCount + ": checkClick returned true, despite an y < minimum bound");
            errorCount++;
        }
    
        testCount++;
        if (this.testObject.checkClick(101,50) != false){
            errors.push( testCount + ": checkClick returned true, despite an x > max bound");
            errorCount++;
        }
    
        testCount++;
        if (this.testObject.checkClick(50,101) != false){
            errors.push( testCount + ": checkClick returned true, despite an y > max bound");
            errorCount++;
        }
    
    
        // output of tests
        if (errorCount != 0){
            console.log(errorCount + "/" + testCount + " Tests failed in canvasObject unit tests:")
            errors.forEach(element => console.log("\t" + element));
            console.log("\n");
        }
        else{
            console.log(testCount + "/" + testCount + " canvasObject unit tests ran without error")
        }
    
        return errorCount;
    }
}
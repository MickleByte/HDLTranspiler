import ClassToTest from '../../src/className.js'

export default class ClassNameTest{
    constructor(){
        this.testObject = new ClassToTest();
    }
    runTests(){
        var errors = [];
        var errorCount = 0;
        var testCount = 0;
    
        // tests
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
        
       
        // output of tests
        if (errorCount != 0){
            console.log(errorCount + "/" + testCount + " Tests failed in CLASS NAME unit tests:")
            errors.forEach(element => console.log("\t" + element));
            console.log("\n");
        }
        else{
            console.log(testCount + "/" + testCount + " CLASS NAME unit tests ran without error")
        }
    
        return errorCount;
    }
}
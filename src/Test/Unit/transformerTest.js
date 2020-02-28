import Transformer from '../../transformer.js'

module.exports = {
    runTests : function () {
        testObject = new Transformer(150, 300);
        
        errors = [];
        errorCount = 0;
        testCount = 0;
    
        // tests
        testCount++;
        if (testObject.xPos != 150){
            errors.push(testCount + ": Incorrect xPosition")
            errorCount++;
        }
        testCount++;
        if (testObject.yPos != 300){
            errors.push(testCount + ": Incorrect yPosition")
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
};
var TestCanvas = require("../../canvas.js");

module.exports = {
    runTests : function () {
        testObject = new TestCanvas(ctx);

        errors = [];
        errorCount = 0;
        testCount = 0;
    
        // tests
        testCount++;
        if (testObject.xPos != 0){
            errors.push(testCount + ": ERROR MESSAGE")
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
};